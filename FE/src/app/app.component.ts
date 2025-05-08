import { Component, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CheckoutService } from './services/checkout.service';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'aurora-shop';

  constructor(private router: Router) {}

  isProductsListPage(): boolean {
    return this.router.url.includes('/shop'); 
  }
}
