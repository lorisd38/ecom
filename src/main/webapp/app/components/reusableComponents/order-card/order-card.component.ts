import { Component, Input } from '@angular/core';
import { IOrder } from '../../../entities/order/order.model';

@Component({
  selector: 'jhi-order-card',
  templateUrl: './order-card.component.html',
})
export class OrderCardComponent {
  @Input() order: IOrder | null = null;

  getIntegerOfPrice(price?: number): string {
    const b = price!.toString().split('.');
    return b[0];
  }

  getDecimalsOfPrice(price?: number): string {
    const b = price!.toString().split('.');
    if (b[1].length <= 1) {
      return b[1] + '0';
    }
    return b[1];
  }
}
