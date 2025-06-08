export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  available: number;
  quantity: number;
  
}

export interface CartRequest {
  cart: CartItem[];
}