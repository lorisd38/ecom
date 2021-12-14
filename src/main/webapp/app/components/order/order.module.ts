import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrderRoutingModule } from './route/order-routing.module';
import { OrderComponent } from './display/order.component';
import { ProductOrderLineComponent } from '../reusableComponents/product-order-line/product-order-line.component';
import { OrderCardComponent } from '../reusableComponents/order-card/order-card.component';

@NgModule({
  imports: [SharedModule, OrderRoutingModule],
  declarations: [OrderComponent, OrderCardComponent, ProductOrderLineComponent],
})
export class OrderModule {}
