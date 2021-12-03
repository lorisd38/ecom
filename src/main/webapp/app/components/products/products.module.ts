import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProductsRoutingModule } from './route/products-routing.module';
import { ProductsComponent } from './list/products.component';
import {ProductCardComponent} from "../product-card/product-card.component";

@NgModule({
  imports: [SharedModule, ProductsRoutingModule],
  declarations: [ProductsComponent, ProductCardComponent],
})
export class ProductsModule {}
