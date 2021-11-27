import * as dayjs from 'dayjs';
import { IProductOrder } from 'app/entities/product-order/product-order.model';
import { IPromotionalCode } from 'app/entities/promotional-code/promotional-code.model';

export interface IOrder {
  id?: number;
  paymentDate?: dayjs.Dayjs;
  receptionDate?: dayjs.Dayjs;
  totalPrice?: number;
  lines?: IProductOrder[] | null;
  promotionalCode?: IPromotionalCode | null;
}

export class Order implements IOrder {
  constructor(
    public id?: number,
    public paymentDate?: dayjs.Dayjs,
    public receptionDate?: dayjs.Dayjs,
    public totalPrice?: number,
    public lines?: IProductOrder[] | null,
    public promotionalCode?: IPromotionalCode | null
  ) {}
}

export function getOrderIdentifier(order: IOrder): number | undefined {
  return order.id;
}
