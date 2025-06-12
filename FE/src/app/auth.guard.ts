import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private snackBar: MatSnackBar) {}
openSnackBar(message: string, action: string, className: string): void {
    console.log('Opening SnackBar with class:', className);
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: [className]
    });
  }
  canActivate(): boolean {
    if (!this.userService.isAuthenticated()) {
      this.openSnackBar('Please log in to continue.', 'Close', 'toast-error');
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }}


