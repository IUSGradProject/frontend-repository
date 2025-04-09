import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../models/product/cart.item.model';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  shipping: number = 0;
  checkedItems: CartItem[]= [];
  totalPrice: number = 0

  constructor(private cartService: CartService, private router: Router) {
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
  }

  assignQuantity(productId: string, quantity: number): void {
    this.cartService.assignQuantity(productId, quantity);
  
    const checkedItem = this.checkedItems.find((i) => i.productId === productId);
    if (checkedItem) {
      checkedItem.quantity = quantity;
    }
  
    this.totalPrice = this.calculateCheckedTotal();
  }
  

  proceedToCheckout(): void {
    this.cartService.saveOrderItems(this.checkedItems)
    this.router.navigate(['checkout'])
  }

  disableRedirect(): boolean{
    return this.totalPrice == 0;
  }
}

