import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProductsRoutingModule } from './route/products-routing.module';
import { ProductsComponent } from './display/products.component';
import { ProductCardComponent } from '../reusableComponents/product-card/product-card.component';
import { ListProductComponent } from '../reusableComponents/list-product/list-product.component';

@NgModule({
  imports: [SharedModule, ProductsRoutingModule],
  declarations: [ProductsComponent, ProductCardComponent, ListProductComponent],
})
export class ProductsModule {}
