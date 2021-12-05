import { Component, Input } from '@angular/core';
import { IProductCart } from '../../../entities/product-cart/product-cart.model';
import { WeightUnit } from '../../../entities/enumerations/weight-unit.model';
import { getPriceWeightStr } from '../../products/products.module';
import { IProduct } from '../../../entities/product/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'jhi-product-line',
  templateUrl: './product-line.component.html',
})
export class ProductLineComponent {
  @Input() productCart: IProductCart | null = null;

  constructor(public cartService: CartService) {
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
    this.updateQuantityProductCart(productCart, 0);
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

  getPriceWeightStrLine(product: IProduct): string {
    return getPriceWeightStr(product);
  }
}
