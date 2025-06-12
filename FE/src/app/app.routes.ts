import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductOverviewComponent } from './components/product-overview/product-overview.component';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { SignupComponent } from './components/signup/signup.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { PurchaseHistoryComponent } from './components/purchase-history/purchase-history.component';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';

export const routes: Routes = [
    { 
        path: '',
        component: HomeComponent
    },
    {
        path: 'shop',
        component: ProductsListComponent
    },
    {
        path: 'product/:id',
        component: ProductOverviewComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'cart',
        component: CartComponent
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'dashboard',
        component: AdminDashboardComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'edit/:id',
        component: EditProductComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'create',
        component: EditProductComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'purchase-history',
        component: PurchaseHistoryComponent,
        canActivate: [AuthGuard]
    }
];
