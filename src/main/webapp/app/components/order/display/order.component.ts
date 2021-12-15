import { Component, OnInit } from '@angular/core';

import { IOrder } from '../../../entities/order/order.model';
import { OrderService } from '../../services/order.service';
import { IProductOrder } from '../../../entities/product-order/product-order.model';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'jhi-order',
  templateUrl: './order.component.html',
})
export class OrderComponent implements OnInit {
  orders?: IOrder[] | null;
  orderId = '';
  constructor(protected orderService: OrderService, public router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.orderId = params.orderId;
    });
    this.loadOrder();
  }

  loadOrder(): void {
    this.orderService.query().subscribe(res => {
      this.orders = res.body ?? null;
    });
  }

  previousState(): void {
    window.history.back();
  }

  trackId(index: number, item: IOrder): number {
    return item.id!;
  }

  trackIdLine(index: number, item: IProductOrder): number {
    return item.id!;
  }

  getOrder(): IOrder | undefined {
    return this.orders?.find(o => o.id!.toString() === this.orderId);
  }
}
