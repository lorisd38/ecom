import { NgModule } from '@angular/core';
import {SharedModule} from "../../shared/shared.module";
import {CartRoutingModule} from "./route/cart-routing.module";
import {CartComponent} from "./list/cart.component";

@NgModule({
  imports: [
    SharedModule,
    CartRoutingModule
  ],
  declarations: [CartComponent]
})
export class CartModule { }
