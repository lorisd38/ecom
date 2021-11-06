import { IProductCart } from 'app/entities/product-cart/product-cart.model';

export interface ICart {
  id?: number;
  lines?: IProductCart[] | null;
}

export class Cart implements ICart {
  constructor(public id?: number, public lines?: IProductCart[] | null) {}
}

export function getCartIdentifier(cart: ICart): number | undefined {
  return cart.id;
}
