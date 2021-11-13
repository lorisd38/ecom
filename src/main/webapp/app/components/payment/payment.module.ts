import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PaymentRoutingModule } from './route/payment-routing.module';
import { PaymentComponent } from './list/payment.component';

@NgModule({
  imports: [SharedModule, PaymentRoutingModule],
  declarations: [PaymentComponent],
})
export class PaymentModule {}
