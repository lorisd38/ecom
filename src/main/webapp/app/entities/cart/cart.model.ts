import { IProductCart } from 'app/entities/product-cart/product-cart.model';
import { IUserDetails } from 'app/entities/user-details/user-details.model';
import { PromotionService } from '../../components/services/promotion.service';

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

export function getTotalCartPrice(cart: ICart | null | undefined, promotionService: PromotionService): number {
  let total = 0.0;
  if (cart?.lines != null) {
    for (const lineProduct of cart.lines) {
      if (lineProduct.quantity != null && lineProduct.product?.price != null) {
        let productUnitPrice: number = lineProduct.product.price;
        if (promotionService.inPromotion(lineProduct.product)) {
          const promo = promotionService.getPromotion(lineProduct.product);
          const subPromo = Number(promo.substr(1, promo.length - 2));
          if (promo.substr(promo.length - 1) === '%') {
            productUnitPrice = lineProduct.product.price - (lineProduct.product.price * subPromo) / 100;
          } else {
            productUnitPrice = lineProduct.product.price - subPromo;
          }
        }
        total += lineProduct.quantity * productUnitPrice;
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

export function getProductQuantity(cart: ICart | null | undefined, productId: number): number {
  if (cart?.lines != null) {
    for (const lineProduct of cart.lines) {
      if (lineProduct.product!.id === productId && lineProduct.quantity != null) {
        return lineProduct.quantity;
      }
    }
  }
  return 0;
}
