import * as dayjs from 'dayjs';
import { IProductOrder } from 'app/entities/product-order/product-order.model';

export interface IOrder {
  id?: number;
  paymentDate?: dayjs.Dayjs;
  receptionDate?: dayjs.Dayjs;
  promoCode?: string | null;
  totalPrice?: number;
  lines?: IProductOrder[] | null;
}

export class Order implements IOrder {
  constructor(
    public id?: number,
    public paymentDate?: dayjs.Dayjs,
    public receptionDate?: dayjs.Dayjs,
    public promoCode?: string | null,
    public totalPrice?: number,
    public lines?: IProductOrder[] | null
  ) {}
}

export function getOrderIdentifier(order: IOrder): number | undefined {
  return order.id;
}
