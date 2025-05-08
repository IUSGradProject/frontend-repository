import { ProductService } from '../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ProductCardInfo } from '../../models/product/product.card.info.model';
import { PaginatedResponse } from '../../models/paginated-response';
import { LoV } from '../../models/lov.model';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product/cart.item.model';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FiltersComponent } from '../filters/filters.component';
import { FormsModule } from '@angular/forms';
import { FilterRequest } from '../../models/filter.request.model';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { getSortData } from '../../data/sort.data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatSidenavModule,
    FiltersComponent,
    FormsModule,
    CommonModule,
    MatSelectModule
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {
  filterRequest!: FilterRequest;
  products: ProductCardInfo[] = []; 
  allProducts: ProductCardInfo[] = []; 
  categories: LoV[] = []; 
  currentPage!: number;
  pageSize!: number; 
  totalRecords!: number;
  resetFilters?: boolean;
  selectedCategories: number[] = []; 
  sort = getSortData();
  selectedCategory: number = 0; 
  isLoggedIn!: boolean;
  private searchSubject = new Subject<string>();
  isLoading: boolean = true;

  constructor(private productService: ProductService, 
    private router: Router, 
    private snackBar: MatSnackBar,
    private cartService: CartService,
   private userService: UserService) {}

  ngOnInit(): void {
    this.initializeRequest();
    this.loadProducts();
    this.loadCategories();
    this.userService.getLoginStatus().subscribe(loggedIn =>
      this.isLoggedIn = loggedIn
    );
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged() 
    ).subscribe(query => {
      this.filterRequest.query = query;
      this.getSearchItems();
    });
  }

  onCategoryChange(categoryId: number) {
    if (categoryId === 0) {
      this.selectedCategories = [];
      
    } else {
      this.selectedCategories = [categoryId]; 
    }
    this.filterRequest = {
      ...this.filterRequest,
      categories: this.selectedCategories?.length ? this.selectedCategories : []

    };
  
    this.currentPage = 1;
    this.loadProducts(); 
  }
  

  onChildDataChange(data: any): void {
    if (data.categories.length === 0) {
      this.selectedCategories = [];
    }
    this.filterRequest = { ...data };
    this.loadProducts();
  }
  openSnackBar(message: string, action: string, className: string, redirect: boolean): void {
    const snackBarRef = this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: [className]
    });
  
    snackBarRef.onAction().subscribe(() => {
      if (redirect && action === 'Login') {
        this.router.navigate(['/login']);
      }
    });
  }
  
  
  private initializeRequest(){
    this.filterRequest = {
      categories: [],
      styles: [],
      brands: [],
      query: "",
    }

    this.selectedCategories = []; 
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe((data: LoV[]) => {
      this.categories = data
    });
  }

  private loadProducts(): void {
    this.isLoading = true;
    console.log(this.filterRequest)
    if (this.filterRequest.categories.length === 0) {
      this.filterRequest.categories = [];
    }
    this.productService
      .getPaginatedProducts(this.currentPage || 1, this.pageSize || 12, this.filterRequest || {})
      .subscribe((response: PaginatedResponse<ProductCardInfo[]>) => {
        this.allProducts = response.data; 
        this.applyFilter(); 
        this.products = response.data
        this.pageSize = response.pageSize
        this.totalRecords = response.totalCount
        this.currentPage = response.pageNumber

        console.log("Products Loaded:", this.products.length);
        console.log("Received Products:", response.data);
        console.log("Sending Filter Request:", this.filterRequest);
        this.isLoading = false
      });
  }  

  private applyFilter(): void {
    if (this.filterRequest.query) {
      const query = this.filterRequest.query.toLowerCase().trim();
      this.products = this.allProducts.filter(product =>
        product.name.toLowerCase().includes(query) 
      );
    } else {
      this.products = [...this.allProducts]; 
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1
    this.pageSize = event.pageSize
    this.loadProducts();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  openProduct(id: string) {
    this.router.navigate(['/product', id]);
  }

  addToCart($event: MouseEvent, item: ProductCardInfo){
    $event?.stopPropagation()
    if (!this.isLoggedIn) {
      this.openSnackBar('You need to log in to add items to your cart.', 'Login', 'toast-info',true);
      return; 
    }else{
    let cartItem: CartItem = {
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      available: item.available,
      quantity: 1
    }
    this.cartService.addToCart(cartItem)
    this.openSnackBar('Product successfully added to cart!', 'Close', 'toast-info', false);
  }}

  
    onSearchInput(event: Event): void {
      const query = (event.target as HTMLInputElement).value;
      this.searchSubject.next(query); 
    }
  
    getSearchItems(): void {
      const query = this.filterRequest.query?.trim().toLowerCase() || '';
  
      if (query) {
        this.products = this.allProducts.filter(product =>
          product.name.toLowerCase().includes(query)
        );
      } else {
        this.products = [...this.allProducts]; 
      }
  
      console.log("Filtered Products:", this.products.length);
    }
  
    highlightMatch(name: string, query: string | undefined): string {
      const safeQuery = query?.trim().toLowerCase() || ''; 
      if (!safeQuery) return name;
    
      const regex = new RegExp(`(${safeQuery})`, 'gi');
      return name.replace(regex, '<strong>$1</strong>');
    }
  }

