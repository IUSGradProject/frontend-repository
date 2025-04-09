import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  constructor(private snackBar: MatSnackBar) {}

  showMessage(message: string, type: 'success' | 'error' | 'warning' | 'info', duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: [`mat-snack-bar-container`, `toast-${type}`],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  success(message: string, duration: number = 3000) {
    this.showMessage(message, 'success', duration);
  }

  error(message: string, duration: number = 3000) {
    this.showMessage(message, 'error', duration);
  }

  warning(message: string, duration: number = 3000) {
    this.showMessage(message, 'warning', duration);
  }

  info(message: string, duration: number = 3000) {
    this.showMessage(message, 'info', duration);
  }
}
