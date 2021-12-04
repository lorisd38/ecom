import {Component, Input, OnInit} from '@angular/core';
import {IProductCart} from "../../entities/product-cart/product-cart.model";
import {WeightUnit} from "../../entities/enumerations/weight-unit.model";
import {CartService} from "../cart/service/cart.service";

@Component({
  selector: 'jhi-product-line',
  templateUrl: './product-line.component.html',
})
export class ProductLineComponent {
  @Input() prductCart : IProductCart | null = null;

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
    if (item.id != null) {
      if (quantity > 0) {
        this.cartService.queryQuantityProductCart(item.id, quantity).subscribe(() => {
          // Reload component
          if (this.cartService.cart?.lines != null) {
            const indexProductCart = this.cartService.cart.lines.indexOf(item);
            this.cartService.cart.lines[indexProductCart].quantity = quantity;
            this.cartService.calcTotal();
          }
        });
      } else if (quantity === 0) {
        this.deleteLine(item);
      }
    }
  }

  deleteLine(productCart: IProductCart): void {
    if (productCart.id != null) {
      this.cartService.queryDeleteProductCart(productCart.id).subscribe(() => {
        // Reload component
        if (this.cartService.cart?.lines != null) {
          const indexProductCart = this.cartService.cart.lines.indexOf(productCart);
          // Splice is a method to delete starting from <index> a given <number of elements>.
          this.cartService.cart.lines.splice(indexProductCart, 1);
          this.cartService.calcTotal();
        }
      });
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
}
