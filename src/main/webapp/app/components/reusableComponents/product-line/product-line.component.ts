import { Component, Input } from '@angular/core';
import { IProductCart } from '../../../entities/product-cart/product-cart.model';
import { WeightUnit } from '../../../entities/enumerations/weight-unit.model';
import { getPriceWeightStr } from '../../products/products.module';
import { IProduct } from '../../../entities/product/product.model';
import { CartService } from '../../services/cart.service';
import { PromotionService } from '../../services/promotion.service';

@Component({
  selector: 'jhi-product-line',
  templateUrl: './product-line.component.html',
})
export class ProductLineComponent {
  @Input() productCart: IProductCart | null = null;

  constructor(public cartService: CartService, public promotionService: PromotionService) {
    // do nothing.
  }

  updateQuantityProductCartByText(item: IProductCart, event: any): void {
    if (event.target.value != null && event.target.value !== '') {
      if (!isNaN(Number(event.target.value))) {
        const quantity: number = +event.target.value;
        this.updateQuantityProductCart(item, quantity);
      }
    }
  }

  updateQuantityProductCart(item: IProductCart, quantity: number): void {
    this.cartService.updateQuantityProduct(item.product!, quantity);
  }

  deleteLine(productCart: IProductCart): void {
    if (confirm("Voulez-vous supprimer l'article '".concat(productCart.product!.name!, "' de votre panier ?"))) {
      this.updateQuantityProductCart(productCart, 0);
    }
  }

  unitOfPrice(weightUnit: WeightUnit): string {
    switch (weightUnit) {
      case WeightUnit.KG:
        return 'kilo';
      case WeightUnit.G:
        return 'kilo';
      case WeightUnit.L:
        return 'litre';
      case WeightUnit.ML:
        return 'litre';
      default:
        return '';
    }
  }

  getStringWeight(product?: IProduct): string {
    if (product!.weightUnit === WeightUnit.ML || product!.weightUnit === WeightUnit.L) {
      return 'L';
    } else if (product!.weightUnit === WeightUnit.G || product!.weightUnit === WeightUnit.KG) {
      return 'kg';
    } else {
      return 'u';
    }
  }

  getPriceWeightStrLine(product: IProduct): string {
    return getPriceWeightStr(product.price!, product.weight!, product.weightUnit!);
  }

  getPrice(productCart: IProductCart): number {
    if (this.promotionService.inPromotion(productCart.product!)) {
      const promo = this.promotionService.getPromotion(productCart.product!);
      const subPromo = Number(promo.substr(1, promo.length - 2));
      if (promo.substr(promo.length - 1) === '%') {
        return productCart.product!.price! - (productCart.product!.price! * subPromo) / 100;
      } else {
        return productCart.product!.price! - subPromo;
      }
    }
    return productCart.product!.price!;
  }

  getPriceWeightStrCardPromo(promo: any, product: IProduct): string {
    const res = Number(getPriceWeightStr(product.price!, product.weight!, product.weightUnit!).replace(',', '.'));
    const subPromo = Number(promo.substr(1, promo.length - 2));
    if (promo.substr(promo.length - 1) === '%') {
      return (res - (res * subPromo) / 100).toFixed(2).toString().replace('.', ',');
    } else {
      return (res - subPromo).toFixed(2).toString().replace('.', ',');
    }
  }
}
