import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductBaseInfo } from '../../models/product/product.base.info.model';
import { ProductService } from '../../services/products.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DeleteConfirmationComponent } from "../delete-confirmation/delete-confirmation.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user-model';
import { UserService } from '../../services/user.service';

export interface Product {
  name: string;
  price: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    FormsModule,
    CommonModule,
    MatPaginator,
    DeleteConfirmationComponent,
    
]
})
export class AdminDashboardComponent implements OnInit{
  displayedColumns: string[] = ['name', 'price', 'actions'];
  dataSource: ProductBaseInfo[] = [];
  currentPage!: number;
  pageSize!: number; 
  totalRecords!: number;
  deleteItem?: string ;
  selectedCategory: string = 'active'; 
  filteredProducts: ProductBaseInfo[] = [];
  showConfirmationModal = false;
  modalTitle = '';
  modalMessage = '';
  modalConfirmText = 'Yes';
  modalCancelText = 'No';
  users: User[] = []; 

  constructor(private productService: ProductService, 
    private snackBar: MatSnackBar, 
    private router: Router,
    private userService: UserService){}

  ngOnInit(): void {
    this.loadProducts();
    this.loadUsers();
  }

  loadProducts(): void {
    const pageNumber = this.currentPage ?? 1; 
    const pageSize = this.pageSize ?? 8; 
  
    if (this.selectedCategory === 'active') {
      this.productService.getAllProducts(pageNumber, pageSize).subscribe(
        response => {
          this.dataSource = response.data;
          this.filteredProducts = [...this.dataSource]; 
          this.totalRecords = response.totalCount;
          this.pageSize = response.pageSize;
          this.currentPage = response.pageNumber;
        },
        error => console.error(error)
      );
    } else if(this.selectedCategory === 'deleted') {
      this.productService.getDeletedProducts().subscribe(
        response => {
          this.dataSource = response;
          this.filteredProducts = [...this.dataSource]; 
        },
        error => console.error(error)
      );
    }else if (this.selectedCategory === 'soldOut') {
      this.productService.getSoldOutProducts().subscribe(
        response => {
          this.dataSource = response; 
          this.filteredProducts = [...this.dataSource];
          this.totalRecords = this.dataSource.length; 
          this.pageSize = pageSize;
          this.currentPage = pageNumber;
        },
        error => console.error(error)
      );
    }
    
  }
  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (response: User[]) => {
        this.users = response; 
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }
  restoreProduct(id: string): void {
    this.productService.restoreProduct(id).subscribe(
      response => {
        console.log('Product restored successfully', response);
        this.loadProducts(); 
        this.openSnackBar('Product successfully restored', 'Close', 'toast-success'); 
      },
      error => {
        this.openSnackBar('Error restoring product. Please try again.', 'Close', 'toast-error'); 
        console.error('Error restoring product', error);
      }
    );
  }
  deactivateUser(user: User): void {
    this.userService.deactivateUser(user.email).subscribe(
      response => {
        console.log('User deactivated successfully:', response);
        this.openSnackBar('User deactivated successfully', 'Close', 'toast-success');
        user.isDeleted = true; 
        this.loadUsers();
      },
      error => {
        console.error('Error deactivating user:', error);
        this.openSnackBar('Failed to deactivate user. Please try again.', 'Close', 'toast-error');
      }
    );
  }
  
  
  openSnackBar(message: string, action: string, className: string): void {
    console.log('Opening SnackBar with class:', className);
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: [className]
    });
  }
  

  setCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1; 
    this.loadProducts();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1
    this.pageSize = event.pageSize
    this.loadProducts();
  }

  editProduct(id: string) {
    this.router.navigate(['/edit', id]);
  }

  private removeProduct(productId: string) {
    this.productService.deleteProduct(productId).subscribe(
      response => {
        this.loadProducts()
        this.openSnackBar('Product successfully removed', 'Close', 'toast-success'); 
      },
      error => console.error(error),      
    )
  }

  createProduct(){
    this.router.navigate(['/create']);
  }


  openDialog(productId: string): void {
    this.showConfirmationModal = true;
    this.modalTitle = 'Confirm Deletion';
    this.modalMessage = 'Are you sure you want to delete this product?';
    this.modalConfirmText = 'Delete';
    this.modalCancelText = 'Cancel';
    this.deleteItem = productId;
    this.showConfirmationModal = true;
  }
  openRestoreDialog(productId: string): void {
    this.showConfirmationModal = true;
    this.modalTitle = 'Confirm Restoration';
    this.modalMessage = 'Are you sure you want to restore this product?';
    this.modalConfirmText = 'Restore';
    this.modalCancelText = 'Cancel';
    this.deleteItem = productId; 
    this.showConfirmationModal = true;
  }

  openUserDeactivationDialog(user: User): void {
    this.showConfirmationModal = true;
    this.modalTitle = 'Confirm User Deactivation';
    this.modalMessage = 'This is a permanent action. Are you sure you want to deactivate this user?';
    this.modalConfirmText = 'Deactivate';
    this.modalCancelText = 'Cancel';
    this.deleteItem = user.email; 
  }
  
  onConfirm(): void {
    if (this.deleteItem) {
      if (this.modalTitle === 'Confirm Deletion') {
        this.removeProduct(this.deleteItem);
      } else if (this.modalTitle === 'Confirm Restoration') {
        this.restoreProduct(this.deleteItem);
      } else if (this.modalTitle === 'Confirm User Deactivation') {
        const user = this.users.find(u => u.email === this.deleteItem);
        if (user) {
          this.deactivateUser(user);
        } else {
          console.error('User not found for deactivation');
        }}
    } else {
      console.error("Error: deleteItem is null");
    }
    this.showConfirmationModal = false;
  }
  

  onCancel(): void {
    this.showConfirmationModal = false;
  }
}
