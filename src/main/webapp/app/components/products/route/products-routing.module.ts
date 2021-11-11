import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from '../list/products.component';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

const productsRoute: Routes = [
  {
    path: '',
    component: ProductsComponent,
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productsRoute)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
