import { Component, OnInit } from '@angular/core';
import { ICart } from '../../../entities/cart/cart.model';
import { IProductCart } from '../../../entities/product-cart/product-cart.model';
import { HttpResponse } from '@angular/common/http';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'jhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart?: ICart | null;
  isLoading = false;
  total = '0';

  constructor(public cartService: CartService) {
    // do nothing.
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;

    this.cartService.queryOneCart().subscribe(
      (res: HttpResponse<ICart>) => {
        this.isLoading = false;
        this.cart = res.body ?? null;
        this.calcTotal();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  calcTotal(): void {
    let tt = 0.0;
    if (this.cart?.lines != null) {
      for (const lineProduct of this.cart.lines) {
        if (lineProduct.quantity != null && lineProduct.product?.price != null) {
          tt += lineProduct.quantity * lineProduct.product.price;
        }
      }
    }
    this.total = tt.toLocaleString();
  }

  updateQuantityProductCart(item: IProductCart, quantity: number): void {
    if (item.id != null) {
      this.cartService.queryQuantityProductCart(item.id, quantity).subscribe(() => {
        // Reload component
        this.ngOnInit();
      });
    }
  }

  updateQuantityProductCartByText(item: IProductCart, event: any): void {
    if (event.target.value != null && event.target.value !== '') {
      if (!isNaN(Number(event.target.value))) {
        if (Number(event.target.value) === 0) {
          this.delete(item);
        } else if (Number(event.target.value) > 0) {
          const quantity: number = event.target.value;
          this.updateQuantityProductCart(item, quantity);
        }
      }
    }
  }

  delete(product: IProductCart): void {
    // TODO: delete product from cart
    console.error('Hello delete!');
  }

  trackId(index: number, item: IProductCart): number {
    return item.id!;
  }
}
