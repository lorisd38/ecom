import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProductRoutingModule } from './route/products-routing.module';
import { ProductsComponent } from './list/products.component';

@NgModule({
  imports: [SharedModule, ProductRoutingModule],
  declarations: [ProductsComponent],
})
export class ProductsModule {}
