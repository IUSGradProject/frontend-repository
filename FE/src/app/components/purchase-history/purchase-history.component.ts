import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { OrderItem } from '../../models/product/order.item.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UserService } from '../../services/user.service';
import { DeleteConfirmationComponent } from "../delete-confirmation/delete-confirmation.component";
@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginator,
    DeleteConfirmationComponent,
  ],
  templateUrl: './purchase-history.component.html',
  styleUrl: './purchase-history.component.css'
})
export class PurchaseHistoryComponent {
  purchaseHistory: OrderItem[][] = []; 
  currentPage!: number;
  pageSize!: number; 
  totalRecords!: number;
  showConfirmationModal = false;
  deleteItem?: string; 
  modalTitle = '';
  modalMessage = '';
  modalConfirmText = 'Yes';
  modalCancelText = 'No';
  userDetails = {
    firstName: sessionStorage.getItem('firstName'),
    lastName: sessionStorage.getItem('lastName'),
    email: sessionStorage.getItem('email')?? '',
  }; 
 
  constructor(private cartService: CartService, private userService: UserService) {}
 
  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(){
    this.cartService.getPurchaseHistory(this.currentPage || 1, this.pageSize || 3).subscribe(
      response => {
        this.purchaseHistory = response.data
        this.currentPage = response.pageNumber
        this.pageSize = response.pageSize
        this.totalRecords = response.totalCount
      }
    );
  }

  subtotal(order: OrderItem): number {
    return order.price * order.quantity
  }

  
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1
    this.pageSize = event.pageSize
    this.loadHistory();
  }

  deactivateUser(email: string): void {
    if (!email) {
      console.error('Email is null or undefined');
      alert('An error occurred while retrieving your email. Please try again.');
      return;
    }

    console.log('Attempting to deactivate user with email:', email); 
    this.userService.deactivateUser(email).subscribe(
      response => {
        console.log('User deactivated successfully:', response);
        

        this.userService.logoutUser();
      },
      error => {
        console.error('Error deactivating user:', error);
        alert('An error occurred while deactivating the user. Please try again.');
      }
    );
  }
  openDeactivationDialog(email: string): void {
    console.log('Opening deactivation dialog for email:', email);
    this.showConfirmationModal = true;
    this.modalTitle = 'Confirm Account Deactivation';
    this.modalMessage = 'This is a permanent action. Are you sure you want to deactivate your account?';
    this.modalConfirmText = 'Deactivate';
    this.modalCancelText = 'Cancel';
    this.deleteItem = email; 
  }
  onConfirm(): void {
    if (this.deleteItem) {
      this.userService.deactivateUser(this.deleteItem).subscribe(
        response => {
          console.log('User deactivated successfully:', response);
          this.userService.logoutUser(); 
          this.showConfirmationModal = false; 
        },
        error => {
          console.error('Error deactivating user:', error);
          alert('An error occurred while deactivating the user. Please try again.');
          this.showConfirmationModal = false; 
        }
      );
    } else {
      console.error("Error: deleteItem is null");
      this.showConfirmationModal = false; 
    }
  }
  onCancel(): void {
    this.showConfirmationModal = false; 
  }
  
}

