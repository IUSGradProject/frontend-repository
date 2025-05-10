import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../models/product/cart.item.model';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { QuantityValidatorDirective } from '../../services/quantity-validator.directive';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, QuantityValidatorDirective],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  shipping: number = 0;
  checkedItems: CartItem[]= [];
  totalPrice: number = 0

  constructor(private cartService: CartService, private router: Router, private snackBar: MatSnackBar) {
    this.cartItems$ = this.cartService.getCart();
  }

  ngOnInit(): void {
  }

  private calculateCheckedTotal(): number {
    var total = this.checkedItems
      .reduce((total, item) => total + item.price * item.quantity, 0);

    this.shipping = total > 0 ? 5.99 : 0

    return total
  }
  openSnackBar(message: string, action: string, className: string): void {
    console.log('Opening SnackBar with class:', className);
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: [className]
    });
  }

  toggleChecked(item: CartItem): void {
    const index = this.checkedItems.findIndex((i) => i.productId === item.productId);
    if (index > -1) {
      this.checkedItems.splice(index, 1);
    } else {
      this.checkedItems.push(item);
    }
    this.totalPrice = this.calculateCheckedTotal()
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
    this.openSnackBar('Item removed from cart', 'Close', 'toast-success');
  }

  assignQuantity(productId: string, quantity: number): void {
    this.cartService.assignQuantity(productId, quantity);
  
    const checkedItem = this.checkedItems.find((i) => i.productId === productId);
    if (checkedItem) {
      checkedItem.quantity = quantity;
    }
  
    this.totalPrice = this.calculateCheckedTotal();
  }
  
  validateQuantity(item: CartItem): void {
    if (item.quantity < 1) {
      item.quantity = 1;
    } else if (item.quantity > item.available) {
      item.quantity = 1;
      this.openSnackBar(`Only ${item.available} items available in stock. Please adjust your quantity.`, 'Close', 'toast-info');
    }
  
    this.assignQuantity(item.productId, item.quantity);
  }

  preventInvalidKeys(event: KeyboardEvent): void {
    const invalidKeys = ['e', 'E', '+', '-', '.', ','];
    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  onQuantityExceeded(item: CartItem): void {
    this.openSnackBar(`Only ${item.available} items available in stock. Please adjust your quantity.`, 'Close', 'toast-info');
    item.quantity = 1;
    this.assignQuantity(item.productId, 1);
  }
  
  proceedToCheckout(): void {
    this.cartService.saveOrderItems(this.checkedItems)
    this.router.navigate(['checkout'])
  }

  disableRedirect(): boolean{
    return this.totalPrice == 0;
  }
}

