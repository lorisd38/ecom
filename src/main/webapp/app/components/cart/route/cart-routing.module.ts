import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CartComponent} from "../list/cart.component";
import {UserRouteAccessService} from "../../../core/auth/user-route-access.service";

const cartRoute: Routes = [
  {
    path: '',
    component: CartComponent,
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cartRoute)],
  exports: [RouterModule],
})
export class CartRoutingModule { }
