import { IProduct } from 'app/entities/product/product.model';
import { IOrder } from 'app/entities/order/order.model';

export interface IProductOrder {
  id?: number;
  quantity?: number;
  price?: number;
  product?: IProduct | null;
  order?: IOrder | null;
}

export class ProductOrder implements IProductOrder {
  constructor(
    public id?: number,
    public quantity?: number,
    public price?: number,
    public product?: IProduct | null,
    public order?: IOrder | null
  ) {}
}

export function getProductOrderIdentifier(productOrder: IProductOrder): number | undefined {
  return productOrder.id;
}
