import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        data: { pageTitle: 'ecomApp.product.home.title' },
        loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
      },
      {
        path: 'panier',
        data: { pageTitle: 'ecomApp.product.home.title' },
        loadChildren: () => import('./cart/cart.module').then(m => m.CartModule),
      },
      {
        path: 'payment',
        data: { pageTitle: 'ecomApp.payment.home.title' },
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
      },
      {
        path: 'categories',
        data: { pageTitle: 'ecomApp.payment.home.title' },
        loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule),
      },
    ]),
  ],
})
export class ComponentsRoutingModule {}
