import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ProductToCartService } from '../service/product-to-cart.service';
import { ICart } from '../../../entities/cart/cart.model';
import { CartService } from '../../cart/service/cart.service';
import { AccountService } from '../../../core/auth/account.service';
import { Account } from '../../../core/auth/account.model';
import { IProductCart } from '../../../entities/product-cart/product-cart.model';
@Component({
  selector: 'jhi-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  products?: IProduct[];
  cart?: ICart | null;
  isLoading = false;
  productsPresent: number[] = [];
  account: Account | null = null;

  constructor(
    protected productService: ProductService,
    protected modalService: NgbModal,
    protected productToCartService: ProductToCartService,
    public cartService: CartService,
    private accountService: AccountService
  ) {}

  loadProduct(): void {
    this.isLoading = true;

    this.productService.query().subscribe(
      (res: HttpResponse<IProduct[]>) => {
        this.products = res.body ?? [];
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.queryOneCart().subscribe(
      (res: HttpResponse<ICart>) => {
        this.isLoading = false;
        this.cart = res.body ?? null;
        if (this.cart?.lines != null) {
          for (const lineProduct of this.cart.lines) {
            if (lineProduct.product?.id != null) {
              this.productsPresent.push(lineProduct.product.id);
            }
          }
        }
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  loadAll(): void {
    this.loadProduct();
    this.accountService.getAuthenticationState().subscribe(res => {
      if (res != null) {
        this.loadCart();
      }
    });
  }

  isPresent(itemId?: number): boolean {
    return itemId != null ? this.productsPresent.includes(itemId) : false;
  }

  updateQuantityProduct(item: IProduct, quantity: number): void {
    if (item.id != null) {
      if (quantity === 0) {
        console.log('Supprimer article du panier (ticket-44)');
        /* this.cartService.queryXXX(xxx).subscribe(() => {
          // Reload component
          this.ngOnInit();
        });*/
      } else if (quantity > 0) {
        this.cartService.queryQuantityProduct(item.id, quantity).subscribe(() => {
          // Reload component
          if (this.cart?.lines != null) {
            for (const line of this.cart.lines) {
              if (line.product?.id === item.id) {
                line.quantity = quantity;
              }
            }
          }
        });
      }
    }
  }

  updateQuantityProductByText(item: IProduct, event: any): void {
    if (event.target.value != null && event.target.value !== '') {
      if (!isNaN(Number(event.target.value))) {
        const quantity: number = event.target.value;
        this.updateQuantityProduct(item, quantity);
      }
    }
  }

  quantityProduct(item: IProduct): number {
    if (this.cart?.lines != null) {
      for (const lineProduct of this.cart.lines) {
        if (lineProduct.product?.id === item.id) {
          if (lineProduct.quantity != null) {
            return lineProduct.quantity;
          }
        }
      }
    }
    return 0;
  }

  ngOnInit(): void {
    this.loadAll();
    this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
  }

  trackId(index: number, item: IProduct): number {
    return item.id!;
  }

  addToCart(product: IProduct): void {
    let productCartToUpdate: IProductCart | null;
    if (product.id !== undefined) {
      // TODO Gestion erreur product id undefined
      this.productToCartService.create(product.id).subscribe((res: HttpResponse<IProductCart>) => {
        // Reload component
        productCartToUpdate = res.body ?? null;
        if (productCartToUpdate != null) {
          this.cart?.lines?.push(productCartToUpdate);
        }
        this.buildCartContentArray();
      });
    }
  }
}
