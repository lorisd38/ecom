import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProductsRoutingModule } from './route/products-routing.module';
import { ProductsComponent } from './display/products.component';
import { ProductCardComponent } from '../reusableComponents/product-card/product-card.component';
import { ListProductComponent } from '../reusableComponents/list-product/list-product.component';
import { CategoriesModule } from '../categories/categories.module';
import { IProduct } from '../../entities/product/product.model';
import { WeightUnit } from '../../entities/enumerations/weight-unit.model';

@NgModule({
  imports: [SharedModule, ProductsRoutingModule, CategoriesModule],
  declarations: [ProductsComponent, ProductCardComponent, ListProductComponent],
})
export class ProductsModule {}

export function getPriceWeightStr(product?: IProduct): string {
  let b = 0;
  b = product!.price! / product!.weight!;
  if (product!.weightUnit === WeightUnit.ML || product!.weightUnit === WeightUnit.G) {
    b = b * 1000;
  }
  return b.toFixed(2).toString().replace('.', ',');
}
