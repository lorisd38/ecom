import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProductCartComponent } from '../list/product-cart.component';
import { ProductCartDetailComponent } from '../detail/product-cart-detail.component';
import { ProductCartUpdateComponent } from '../update/product-cart-update.component';
import { ProductCartRoutingResolveService } from './product-cart-routing-resolve.service';

const productCartRoute: Routes = [
  {
    path: '',
    component: ProductCartComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductCartDetailComponent,
    resolve: {
      productCart: ProductCartRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductCartUpdateComponent,
    resolve: {
      productCart: ProductCartRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductCartUpdateComponent,
    resolve: {
      productCart: ProductCartRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productCartRoute)],
  exports: [RouterModule],
})
export class ProductCartRoutingModule {}
