import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading = new BehaviorSubject<boolean>(false);
  private excludedRoutes: string[] = ['/shop']; 

  constructor(private router: Router) {}

  setLoading(loading: boolean) {
    const currentRoute = this.router.url;
    if (this.excludedRoutes.some(route => currentRoute.includes(route))) {
      this.loading.next(false); 
    } else {
      this.loading.next(loading); 
    }
}
}