import { Injectable } from "@angular/core";
import { CartItem, CartRequest } from "../models/product/cart.item.model";
import { CartService } from "./cart.service";
import { async, BehaviorSubject, map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root',
  })
export class CheckoutService {

    constructor(private cartService: CartService, private http: HttpClient){
    }

    getTotalPrice(): number{
        return this.cartService.getOrderItems().reduce((total, item) => total + item.price * item.quantity, 0);
    }

    saveOrder(){
      var request: CartRequest={
        cart: this.cartService.getOrderItems()
      }
      this.http.post('http://localhost:5014/Carts/Order', request, { withCredentials: true }).subscribe(
        response => {
          this.cartService.loadCartFromBackend()
        },
        error => console.error(error)
        
      )
    }

  }
  