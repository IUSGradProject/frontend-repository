import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateAccountRequest } from "../models/create-account-request.model";
import { LoginUser } from "../models/login-user.model";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { LoginResponse } from "../models/login-response";
import { User } from "../models/user-model";
import * as jwt_decode from "jwt-decode";
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError,timeout } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { RoleResponse } from "../models/role.response.mode";



@Injectable({
    providedIn: 'root',
  })
export class UserService{
    private baseUrl = environment.apiUrl;
    constructor(private http: HttpClient, private router: Router,private snackBar: MatSnackBar) {
    }

    

    private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());

getLoginStatus(): Observable<boolean> {
  return this.loginStatus.asObservable();
}

checkLoginStatus(): boolean {
  const token = sessionStorage.getItem('token');
  const loggedIn = sessionStorage.getItem('loggedIn');
  return !!token && loggedIn === 'true';
}


    registerUser(userData: CreateAccountRequest): Observable<RoleResponse>{
        return this.http.post<RoleResponse>(`${this.baseUrl}Users`, userData);
    }

       
    
    loginUser(userData: LoginUser) {
        return this.http.put<LoginResponse>(`${this.baseUrl}Users/Login`, userData, { withCredentials: true }).pipe(
            tap(response => {
                // Store token and role on successful login
                sessionStorage.setItem('loggedIn', 'true');
                sessionStorage.setItem('role', response.role);
                sessionStorage.setItem('token', response.token);
                this.loginStatus.next(true);
            }),
            catchError(error => {
                if (error.status === 401 && error.error?.message?.includes('deactivated')) {
                    this.snackBar.open('This account has been deactivated. Please contact support.', 'Close', {
                        duration: 3000,
                        panelClass: ['toast-error']
                    });
                } else {
                    this.snackBar.open('Invalid email or password.', 'Close', {
                        duration: 3000,
                        panelClass: ['toast-error']
                    });
                }
                throw error; 
            })
        );
    }

    isAdmin(){
      const storedValue = sessionStorage.getItem('role');
      console.log(sessionStorage)
      return storedValue === 'Admin';
    }

    isAuthenticated(): boolean{
        return this.checkLoginStatus()
    }

    getRoles(): string | null {
  return sessionStorage.getItem('role');
}

    successfulLogin(role: string, firstName: string, lastName: string, email: string){
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('role', role);        
        sessionStorage.setItem('firstName', firstName);
        sessionStorage.setItem('lastName', lastName);
        sessionStorage.setItem('email', email);
        this.loginStatus.next(true)
    }

    // successfulLogout(){
    //     sessionStorage.clear();
    //     this.loginStatus.next(false)
    // }

  // In UserService
logoutUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}Users/Logout`, { withCredentials: true }).pipe(
      tap(() => {
        console.log("Calling successfulLogout");
        this.successfulLogout(); 
        console.log("Logged out");
      }),
      catchError((error) => {
        console.error("Logout failed:", error);
        throw error; 
      })
    );
  }
  
  private successfulLogout(): void {
    console.log("Before clear", sessionStorage);
    sessionStorage.clear();
    localStorage.clear();
    console.log("After clear", sessionStorage);
    this.loginStatus.next(false); 
  }

    deactivateUser(email: string): Observable<any> {
      if (!email) {
          console.error('Email is null or undefined');
          throw new Error('Email is required to deactivate a user.');
      }
  
      const url = `${this.baseUrl}Users/deactivate/${encodeURIComponent(email)}`;
      console.log('Sending DELETE request to:', url); 
      return this.http.delete(url);
  }
    getAllUsers(): Observable<User[]> {
      return this.http.get<User[]>(this.baseUrl + 'Users/all');
    }
    
}