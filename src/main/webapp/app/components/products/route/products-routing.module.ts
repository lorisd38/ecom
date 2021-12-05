import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from '../display/products.component';

const productsRoute: Routes = [
  {
    path: '',
    component: ProductsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(productsRoute)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
