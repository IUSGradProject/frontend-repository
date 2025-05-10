import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductOverview } from '../../models/product/product.overview.model';
import { ProductService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product/cart.item.model';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { Location } from '@angular/common';
import { QuantityValidatorDirective } from '../../services/quantity-validator.directive';

@Component({
  selector: 'app-product-overview',
  standalone: true,
  imports: [FormsModule, CommonModule, DeleteConfirmationComponent, QuantityValidatorDirective],
  templateUrl: './product-overview.component.html',
  styleUrl: './product-overview.component.css'
})
export class ProductOverviewComponent implements OnInit {
  productId!: string;
  product! : ProductOverview;
  quantity!: number;
  totalPrice!: number;
  isLoggedIn!: boolean;
  showLoginPrompt: boolean = false;
  popupStyle: string = 'login-prompt';

  constructor(
    private route: ActivatedRoute, 
    private productService: ProductService, 
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar, 
    private userService: UserService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getId()
    this.loadProduct()

    this.userService.getLoginStatus().subscribe(loggedIn =>
      this.isLoggedIn = loggedIn
    )
  }

  goBack() {
    this.location.back();
  }
  
  private getId(): void{
    this.route.params.subscribe(params => {
      this.productId = params['id'];
    });
  }

  private loadProduct(): void{
    this.productService.getProduct(this.productId).subscribe((data: ProductOverview) => {
      this.product = data
      this.quantity = 1
      this.updateTotalPrice()
    });
  }
  openSnackBar(message: string, action: string, className: string): void {
    console.log('Opening SnackBar with class:', className);
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: [className]
    });
    
  }

  onQuantityExceeded(max: number): void {
    this.openSnackBar(`Only ${max} items available in stock. Please adjust your quantity.`, 'Close', 'toast-info');
    this.quantity = 1;
    this.updateTotalPrice(); 
  }
  

  updateTotalPrice(): void {
    if (this.quantity > 0 && this.quantity <= this.product.available) {
      this.totalPrice = this.product.price * this.quantity; 
    } else {
      this.totalPrice = this.product.price; 
    }
  }
  
  addToCart(product: ProductOverview): void {
    if (!this.isLoggedIn) {
      this.showLoginPrompt = true; 
    } else {
      const cartItem = this.mapToCartItem(product);
      this.cartService.addToCart(cartItem);
      this.openSnackBar('Product successfully added to cart!', 'Close', 'toast-info');
    }
  }

  buyNow(product: ProductOverview): void {
    if (!this.isLoggedIn) {
      this.showLoginPrompt = true; // Show the login prompt modal
    } else {
      const cartItem = this.mapToCartItem(product);
      this.cartService.saveOrderItems([cartItem]);
      this.router.navigate(['checkout']);
    }
  }


  private mapToCartItem(product: ProductOverview): CartItem{
    return {
      productId: product.productId,
      name: product.name,
      image: product.image,
      price: product.price,
      available: product.available,
      quantity: this.quantity
    }
  }
  onLoginPromptConfirm(): void {
    this.router.navigate(['login']); 
    this.showLoginPrompt = false; 
  }

  onLoginPromptCancel(): void {
    this.showLoginPrompt = false; 
  }
}