import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'products',
        data: { pageTitle: 'ecomApp.product.home.title' },
        loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
      },
    ]),
  ],
})
export class ComponentsRoutingModule {}
