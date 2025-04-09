import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userRoles = this.userService.getRoles();

    if (this.userService.isAuthenticated() && userRoles == "Admin") {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
