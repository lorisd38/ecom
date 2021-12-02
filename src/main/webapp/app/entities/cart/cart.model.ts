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

export function getTotalCartPrice(cart: ICart | null | undefined): number {
  let total = 0.0;
  if (cart?.lines != null) {
    for (const lineProduct of cart.lines) {
      if (lineProduct.quantity != null && lineProduct.product?.price != null) {
        total += lineProduct.quantity * lineProduct.product.price;
      }
    }
  }
  return total;
}

export function getTotalCartItems(cart: ICart | null | undefined): number {
  let total = 0;
  if (cart?.lines != null) {
    for (const lineProduct of cart.lines) {
      if (lineProduct.quantity != null && lineProduct.product?.price != null) {
        total += 1;
      }
    }
  }
  return total;
}
