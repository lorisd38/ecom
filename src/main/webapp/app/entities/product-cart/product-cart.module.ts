import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProductCartComponent } from './list/product-cart.component';
import { ProductCartDetailComponent } from './detail/product-cart-detail.component';
import { ProductCartUpdateComponent } from './update/product-cart-update.component';
import { ProductCartDeleteDialogComponent } from './delete/product-cart-delete-dialog.component';
import { ProductCartRoutingModule } from './route/product-cart-routing.module';

@NgModule({
  imports: [SharedModule, ProductCartRoutingModule],
  declarations: [ProductCartComponent, ProductCartDetailComponent, ProductCartUpdateComponent, ProductCartDeleteDialogComponent],
  entryComponents: [ProductCartDeleteDialogComponent],
})
export class ProductCartModule {}
