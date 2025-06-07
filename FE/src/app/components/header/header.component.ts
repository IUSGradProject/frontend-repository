import { Component, HostListener, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 isLoggedIn!: boolean;
 totalItems!: Observable<number>;
 isAdmin!: boolean;

 constructor(private cartService: CartService, private userService: UserService, private router: Router){
  
 }

 ngOnInit(): void {
  
  this.totalItems = this.cartService.getCartItemCount();
  this.userService.getLoginStatus().subscribe(status => {
    this.isLoggedIn = status;
     this.isAdmin = this.userService.isAdmin(); 
    console.log("Login status changed to", status);
  });
  
}

logOut() {
  console.log("Logout button clicked");
  this.userService.logoutUser().subscribe({
    next: () => {
          this.router.navigate(['/login']);
    },
    error: (error) => {
      console.error("Logout failed:", error);
    }
  });
}
  menuActive = false;
  isLargeScreen = window.innerWidth > 768;

  toggleMenu(): void {
      this.menuActive = !this.menuActive;
  }

  closeMenu(): void {
    this.menuActive = false;
}

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
      this.isLargeScreen = (event.target as Window).innerWidth > 768;
      if (this.isLargeScreen) {
          this.menuActive = false;
      }
  }
}
