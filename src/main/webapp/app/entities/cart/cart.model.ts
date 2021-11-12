import { IProductCart } from 'app/entities/product-cart/product-cart.model';
import { IUserDetails } from 'app/entities/user-details/user-details.model';

export interface ICart {
  id?: number;
  lines?: IProductCart[] | null;
  user?: IUserDetails | null;
}

export class Cart implements ICart {
  constructor(public id?: number, public lines?: IProductCart[] | null, public user?: IUserDetails | null) {}
}

export function getCartIdentifier(cart: ICart): number | undefined {
  return cart.id;
}
