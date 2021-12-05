import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProductsRoutingModule } from './route/products-routing.module';
import { ProductsComponent } from './display/products.component';
import { ProductCardComponent } from '../reusableComponents/product-card/product-card.component';
import { ListProductComponent } from '../reusableComponents/list-product/list-product.component';
import {CategoriesModule} from "../categories/categories.module";

@NgModule({
  imports: [SharedModule, ProductsRoutingModule, CategoriesModule],
  declarations: [ProductsComponent, ProductCardComponent, ListProductComponent],
})
export class ProductsModule {}
