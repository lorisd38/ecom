import { Component, Input } from '@angular/core';
import { IProduct } from '../../../entities/product/product.model';
import { AccountService } from '../../../core/auth/account.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'jhi-product-card',
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input() product: IProduct | null = null;

  constructor(
    protected productService: ProductService,
    public accountService: AccountService,
    private router: Router,
    public cartService: CartService
  ) {}

  isFavorites(product: IProduct): boolean {
    return this.productService.isFavorites(product);
  }

  addToFavorite(product: IProduct): void {
    // If no connected redirection to login page.
    if (!this.accountService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    } else if (product.id !== undefined) {
      this.productService.addToFavorites(product.id);
    }
  }

  getIntegerOfPrice(price?: number): string {
    const b = price!.toString().split('.');
    return b[0];
  }

  getDecimalsOfPrice(price?: number): string {
    const b = price!.toString().split('.');
    if (b[1].length <= 1) {
      return b[1] + '0';
    }
    return b[1];
  }

  isPresent(productId?: number): boolean {
    return this.cartService.productsMap.has(<number>productId);
  }

  addToCart(product: IProduct): void {
    // If no connected redirection to login page.
    if (!this.accountService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addToCart(product);
  }

  quantityProduct(item: IProduct): number {
    const lineProduct = this.cartService.getProductCart(item);
    return lineProduct?.quantity ?? 0;
  }

  updateQuantityProduct(item: IProduct, quantity: number): void {
    this.cartService.updateQuantityProduct(item, quantity);
  }

  updateQuantityProductByText(item: IProduct, event: any): void {
    if (event.target.value != null && event.target.value !== '') {
      if (!isNaN(Number(event.target.value))) {
        const quantity: number = +event.target.value;
        this.updateQuantityProduct(item, quantity);
      }
    }
  }
}
