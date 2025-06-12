import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

 canActivate(): boolean {
    if (!this.userService.isAuthenticated()) {
      // User is not logged in → redirect to login
      this.router.navigate(['/login']);
      return false;
    }

    if (!this.userService.isAdmin()) {
      this.router.navigate(['/shop']); 
      return false;
    }

    return true;
  }
}
