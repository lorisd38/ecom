import { IProduct } from 'app/entities/product/product.model';
import { ICart } from 'app/entities/cart/cart.model';

export interface IProductCart {
  id?: number;
  quantity?: number;
  product?: IProduct | null;
  cart?: ICart | null;
}

export class ProductCart implements IProductCart {
  constructor(public id?: number, public quantity?: number, public product?: IProduct | null, public cart?: ICart | null) {}
}

export function getProductCartIdentifier(productCart: IProductCart): number | undefined {
  return productCart.id;
}
