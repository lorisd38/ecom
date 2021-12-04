import { Component, Input } from '@angular/core';
import { IProduct } from '../../entities/product/product.model';
import { ProductService } from '../../entities/product/service/product.service';
import { AccountService } from '../../core/auth/account.service';
import { IProductCart } from '../../entities/product-cart/product-cart.model';
import { Router } from '@angular/router';
import { ProductToCartService } from '../products/service/product-to-cart.service';
import { CartService } from '../cart/service/cart.service';

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
    protected productToCartService: ProductToCartService,
    public cartService: CartService
  ) {}

  isFavorites(product: IProduct): boolean {
    const size = this.productService.listFavorites?.filter(p => p.id === product.id).length;
    return size != null && size > 0;
  }

  addToFavorite(product: IProduct): void {
    // If no connected redirection to login page.
    if (!this.accountService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    } else if (product.id !== undefined) {
      this.productService.editFavorites(product.id).subscribe((res: IProduct[]) => {
        this.productService.listFavorites = res;
      });
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
    return this.productToCartService.productsMap.has(<number>productId);
  }

  addToCart(product: IProduct): void {
    // If no connected redirection to login page.
    if (!this.accountService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.productToCartService.addToCart(product, this.cartService);
  }

  quantityProduct(item: IProduct): number {
    const lineProduct = this.productToCartService.getProductCart(item);
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
