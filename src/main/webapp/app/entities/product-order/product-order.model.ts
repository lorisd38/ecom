import { IProduct } from 'app/entities/product/product.model';
import { IOrder } from 'app/entities/order/order.model';
import { ReductionType } from 'app/entities/enumerations/reduction-type.model';

export interface IProductOrder {
  id?: number;
  quantity?: number;
  price?: number;
  promotionValue?: number | null;
  promotionType?: ReductionType | null;
  promoCodeValue?: number | null;
  promoCodeType?: ReductionType | null;
  product?: IProduct | null;
  order?: IOrder | null;
}

export class ProductOrder implements IProductOrder {
  constructor(
    public id?: number,
    public quantity?: number,
    public price?: number,
    public promotionValue?: number | null,
    public promotionType?: ReductionType | null,
    public promoCodeValue?: number | null,
    public promoCodeType?: ReductionType | null,
    public product?: IProduct | null,
    public order?: IOrder | null
  ) {}
}

export function getProductOrderIdentifier(productOrder: IProductOrder): number | undefined {
  return productOrder.id;
}
