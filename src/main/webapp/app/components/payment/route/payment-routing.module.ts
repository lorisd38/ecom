import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PaymentComponent } from '../list/payment.component';

const paymentRoute: Routes = [
  {
    path: '',
    component: PaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(paymentRoute)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
