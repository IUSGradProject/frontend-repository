import { ChangeDetectorRef, Component } from '@angular/core';
import { CreateAccountRequest } from '../../models/create-account-request.model';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    CommonModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SignupComponent {
  signupForm!: FormGroup
  showValidationErrors: boolean = false;
  successfulSignup: boolean = true;

  constructor(private userService: UserService,
    private snackBar: MatSnackBar,  private router: Router, private cdr: ChangeDetectorRef){
    this.initializeForm()
  }

  initializeForm(){
    this.signupForm = new FormGroup(
      {
        username: new FormControl('', [Validators.required, Validators.minLength(2)]),
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, this.passwordPolicyValidator()]),
        confirmPassword: new FormControl('', [Validators.required, this.passwordMatchValidator()]),
      },
      { validators: this.passwordMatchValidator() } 
    );
  }
  openSnackBar(message: string, action: string, className: string): void {
    console.log('Opening SnackBar with class:', className);
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: [className]
    });
    
  }

  passwordMatchValidator(): (group: AbstractControl) => ValidationErrors | null {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;

      if (password && confirmPassword && password !== confirmPassword) {
        group.get('confirmPassword')?.setErrors({ passwordsMismatch: true });
        return { passwordsMismatch: true };
      }
      if (group.get('confirmPassword')?.hasError('passwordsMismatch')) {
        group.get('confirmPassword')?.setErrors(null);
      }
      return null;
    };
  }

  passwordPolicyValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordRegex.test(password)) {
        return { invalidPassword: true };
      }
      return null;
    };
  }

  registerClicked() {
    this.showValidationErrors = true;
    if (this.signupForm.valid) {
      const createAccountData: CreateAccountRequest = this.signupForm.value as CreateAccountRequest;
      this.userService.registerUser(createAccountData).subscribe(
        data => {
          this.router.navigate(['/login'])
          this.openSnackBar('Registration successful! Welcome aboard!', 'Close', 'toast-success'); 
        },
        error => {
          this.successfulSignup = false
          this.showValidationErrors = true
          console.log(this.successfulSignup)
        }
      )
    }
  }
}
