import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LoginUser } from '../../models/login-user.model';
import { CartService } from '../../services/cart.service';
import { finalize, Observable } from 'rxjs';
import { Route, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent{
  loginForm!: FormGroup
  successfulLogin: boolean = true;
  emptyFields: boolean = false;

  constructor(private userService: UserService,
    private snackBar: MatSnackBar,  private router: Router) {
    this.initializeForm()
  }

  initializeForm(){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  openSnackBar(message: string, action: string, className: string): void {
    console.log('Opening SnackBar with class:', className);
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: [className]
    });
    
  }
  loginClicked(){
    if (this.loginForm.invalid) {
      this.emptyFields = true;             
      this.successfulLogin = true;          
      return;                               
    }

    this.emptyFields = false;  
      const loginData: LoginUser = this.loginForm.value as LoginUser;
      this.userService.loginUser(loginData).subscribe(
        response => {
          this.userService.successfulLogin(response.role, response.firstName, response.lastName, response.email);
          this.router.navigate(['/shop'])
          this.openSnackBar("Welcome back! You have successfully logged in.", 'Close', 'toast-success'); 
        },
        error => this.successfulLogin = false
      )
    }
  }

