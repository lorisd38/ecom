import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ProductToCartService } from '../service/product-to-cart.service';
import { ICart } from '../../../entities/cart/cart.model';
import { CartService } from '../../cart/service/cart.service';

@Component({
  selector: 'jhi-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  products?: IProduct[];
  cart?: ICart | null;
  isLoading = false;
  productsPresent: number[] = [];

  constructor(
    protected productService: ProductService,
    protected modalService: NgbModal,
    protected productToCartService: ProductToCartService,
    public cartService: CartService
  ) {}

  loadProduct(): void {
    this.isLoading = true;

    this.productService.query().subscribe(
      (res: HttpResponse<IProduct[]>) => {
        this.products = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  loadCart(): void {
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
    this.loadCart();
  }

  isPresent(itemId?: number): boolean {
    return itemId != null ? this.productsPresent.includes(itemId) : false;
  }

  updateQuantityProduct(item: IProduct, quantity: number): void {
    if (item.id != null) {
      this.cartService.queryQuantityProductCart(item.id, quantity).subscribe();
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
  }

  trackId(index: number, item: IProduct): number {
    return item.id!;
  }

  addToCart(product: IProduct): void {
    if (product.id !== undefined) {
      // TODO Gestion erreur product id undefined
      this.productToCartService.create(product.id).subscribe();
    }
  }
}
