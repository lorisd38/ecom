import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrderComponent } from '../display/order.component';

const orderRoute: Routes = [
  {
    path: '',
    component: OrderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(orderRoute)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
