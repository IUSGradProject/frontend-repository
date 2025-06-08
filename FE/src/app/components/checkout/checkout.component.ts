import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { CheckoutService } from '../../services/checkout.service';
import { UserService } from '../../services/user.service';
import { OrderItem } from '../../models/product/order.item.model';
import { CartItem } from '../../models/product/cart.item.model';
import { Router } from '@angular/router';
import { MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDividerModule,
  ],
   encapsulation: ViewEncapsulation.None,
})
export class CheckoutComponent implements OnInit{
  checkoutForm!: FormGroup;
  totalPrice!: number;
  isLoggedIn!: boolean;
  order! : CartItem[];

  constructor(private fb: FormBuilder, private checkoutService: CheckoutService,
     private cartService: CartService, 
     private snackBar: MatSnackBar, 
     private router: Router) {
    this.initializeForm()
    this.setTotalPrice()
    this.loadCart()
    
    this.isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
  }

  ngOnInit(): void {
    this.changeValidation();
  }

  loadCart(){
    this.order = this.cartService.getOrderItems()
  }

  private setTotalPrice(){
    this.totalPrice = this.checkoutService.getTotalPrice()
    if(this.totalPrice > 0)
      this.totalPrice += 5.99 //Add shipping to price
  }

  openSnackBar(message: string, action: string, className: string): void {
    console.log('Opening SnackBar with class:', className);
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: [className]
    });
    
  }

  private initializeForm(){
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],
    });
  }

  changeValidation(){
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe((paymentMethod) => {
      if (paymentMethod === 'credit') {
        this.checkoutForm.get('cardNumber')?.setValidators(Validators.required);
        this.checkoutForm.get('expirationDate')?.setValidators(Validators.required);
        this.checkoutForm.get('cvv')?.setValidators(Validators.required);
      } else {
        this.checkoutForm.get('cardNumber')?.clearValidators();
        this.checkoutForm.get('expirationDate')?.clearValidators();
        this.checkoutForm.get('cvv')?.clearValidators();
      }
  
      this.checkoutForm.get('cardNumber')?.updateValueAndValidity();
      this.checkoutForm.get('expirationDate')?.updateValueAndValidity();
      this.checkoutForm.get('cvv')?.updateValueAndValidity();
    })
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.checkoutService.saveOrder();
      this.openSnackBar('Your order has been successfully placed', 'Close', 'toast-info'); 
      this.router.navigate([''])
    }
  }

  subtotal(order: CartItem): number {
    return order.price * order.quantity
  }
}
