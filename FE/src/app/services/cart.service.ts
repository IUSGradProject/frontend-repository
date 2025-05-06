import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, CartRequest } from '../models/product/cart.item.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserService } from './user.service';
import { __param } from 'tslib';
import { OrderItem } from '../models/product/order.item.model';
import { PaginatedResponse } from '../models/paginated-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private baseUrl = environment.apiUrl;
  private cart = new BehaviorSubject<CartItem[]>([]);
  private cartSubject = new BehaviorSubject<number>(0);
  //private baseUrl = 'https://heyappo.me/aurora/api/';
  private cartKey = 'cart';

  constructor(private http: HttpClient, private userService: UserService) {
    this.initializeCart();

    this.userService.getLoginStatus().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.saveCartAfterLogin();
        this.loadCartFromBackend();
      }
    });
  }

  private initializeCart(): void {
    this.isUserLoggedIn().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.loadCartFromBackend();
      } else {
        const cart = this.getCartFromStorage();
        this.updateCart(cart);
      }
    })
  }

  private isUserLoggedIn() {
     return this.userService.getLoginStatus()
  }

  addToCart(item: CartItem): void {
    const cart = this.cart.value;
    const existingIndex = cart.findIndex((i) => i.productId === item.productId);

    console.log(cart[existingIndex]);

    if (existingIndex > -1 && cart[existingIndex].available >= cart[existingIndex].quantity + item.quantity) {
      cart[existingIndex].quantity += item.quantity;
    } else if(existingIndex == -1 && item.available >= item.quantity){
      cart.push(item);
    }

    this.isUserLoggedIn().subscribe((loggedIn) => {
      if (loggedIn) {
        this.saveCartItem(item)
      }
    })

    this.saveCart(cart);
  }

  async assignQuantity(productId: string, quantity: number = 1): Promise<void> {
    const cart = this.cart.value;
    const index = cart.findIndex((i) => i.productId === productId);

    if (index > -1) {
      cart[index].quantity = quantity;

      this.isUserLoggedIn().subscribe((loggedIn) => {
        if (loggedIn) {
          this.saveCartItem(cart[index])
        }
      })
  
      this.saveCart(cart);
    }
  }

  removeFromCart(productId: string): void {
    const cart = this.cart.value.filter((item) => item.productId !== productId);

    this.isUserLoggedIn().subscribe((loggedIn) => {
      if (loggedIn) {
        this.deleteItem(productId)
      }
    })

    this.saveCart(cart);
  }

  getCart(): Observable<CartItem[]> {
    return this.cart.asObservable();
  }

  getCartItemCount(): Observable<number> {
    return this.cartSubject.asObservable();
  }

  private saveCartAfterLogin() {
    const localCart = this.cart.value;

    const request: CartRequest = {
      cart: localCart,
    };

    return this.http.post(`${this.baseUrl}Carts/Items`, request, { withCredentials: true }).subscribe(
      (response) => {
        this.clearLocalCart();
        this.loadCartFromBackend();
      },
      (error) => console.error("Failed to save cart: ", error)
    );
  }

  loadCartFromBackend(): void {
    this.http.get<CartItem[]>(`${this.baseUrl}Carts`, { withCredentials: true }).subscribe(
      (cartItems) => {
        this.updateCart(cartItems);
      },
      (error) => console.error('Failed to load cart from backend:', error)
    );
  }

  private saveCart(cart: CartItem[]): void {
    this.isUserLoggedIn().subscribe((loggedIn) => {
      if (!loggedIn) {
        sessionStorage.setItem(this.cartKey, JSON.stringify(cart));
      }
    })

    this.updateCart(cart)
  }

  private deleteItem(productId: string){
    this.http.delete(`${this.baseUrl}Carts/${productId}` , { withCredentials: true }).subscribe(
      response => {},
      error => console.error()
    )
  }

  private getCartFromStorage(): CartItem[] {
    const cart = sessionStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  private updateCart(cart: CartItem[]): void {
    this.cart.next(cart);
    this.cartSubject.next(cart.length)
  }

  private clearLocalCart(): void {
    sessionStorage.removeItem(this.cartKey);
    this.updateCart([]);
  }

  private saveCartItem(cart: CartItem){
    this.http.post(`${this.baseUrl}Carts`, cart, { withCredentials: true }).subscribe(
      (response) => {
        console.log("Saved!")
      },
      (error) => console.error('Failed to save item:', error)
    );
  }

  saveOrderItems(itemsToBuy: CartItem[]): void{
    console.log("Save items to checkout", itemsToBuy)
    sessionStorage.setItem('buyItems', JSON.stringify(itemsToBuy))
  }

  getOrderItems(): CartItem[]{
    var order = sessionStorage.getItem('buyItems')
    var items = order ? JSON.parse(order) : []
    console.log("Get items for checkout",items)
    return items
  }

  getPurchaseHistory(
    page: number,
    pageSize: number
  ): Observable<PaginatedResponse<OrderItem[][]>>{
    const params = new HttpParams()
      .set('pageNumber', page)
      .set('pageSize', pageSize)
      
    return this.http.get<PaginatedResponse<OrderItem[][]>>(`${this.baseUrl}Carts/Order`, { params, withCredentials: true })
  }
}
