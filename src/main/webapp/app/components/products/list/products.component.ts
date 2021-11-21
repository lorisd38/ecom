import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ProductToCartService } from '../service/product-to-cart.service';
import { ICart } from 'app/entities/cart/cart.model';
import { CartService } from '../../cart/service/cart.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { IProductCart } from 'app/entities/product-cart/product-cart.model';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'jhi-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  products?: IProduct[];
  cart?: ICart | null;
  isLoading = false;
  productsMap: Map<number, IProductCart> = new Map();
  account: Account | null = null;
  public query: string | null = '';

  constructor(
    protected productService: ProductService,
    protected modalService: NgbModal,
    protected productToCartService: ProductToCartService,
    public cartService: CartService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params.query !== undefined) {
        this.query = params.query;
        this.loadProductSearch();
      } else {
        this.loadAll();
        this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
      }
    });
  }

  loadProductSearch(): void {
    this.isLoading = true;
    this.query
      ? this.productService.querySearch(this.query).subscribe(
          (res: HttpResponse<IProduct[]>) => {
            this.products = res.body ?? [];
            this.isLoading = false;
          },
          () => {
            this.isLoading = false;
          }
        )
      : '';
  }

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
        this.buildCartContentMap();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  buildCartContentMap(): void {
    this.productsMap.clear();
    if (this.cart?.lines != null) {
      this.cart.lines.forEach(lineProduct => this.productsMap.set(lineProduct.product!.id!, lineProduct));
    }
  }

  loadAll(): void {
    this.loadProduct();
    this.accountService.getAuthenticationState().subscribe(res => {
      if (res != null) {
        this.loadCart();
      }
    });
  }

  isPresent(productId?: number): boolean {
    return this.productsMap.has(<number>productId);
  }

  updateQuantityProduct(item: IProduct, quantity: number): void {
    if (item.id != null) {
      if (quantity > 0) {
        this.cartService.queryQuantityProduct(item.id, quantity).subscribe(() => {
          // Reload component
          const productLine: IProductCart | undefined = this.cart?.lines?.find(line => line.product?.id === item.id);
          if (productLine != null) {
            productLine.quantity = quantity;
          }
        });
      } else if (quantity === 0) {
        this.deleteProduct(item);
      }
    }
  }

  updateQuantityProductByText(item: IProduct, event: any): void {
    if (event.target.value != null && event.target.value !== '') {
      if (!isNaN(Number(event.target.value))) {
        const quantity: number = +event.target.value;
        this.updateQuantityProduct(item, quantity);
      }
    }
  }
  getProductCart(item: IProduct): IProductCart | undefined {
    return this.productsMap.get(<number>item.id);
  }

  quantityProduct(item: IProduct): number {
    const lineProduct = this.getProductCart(item);
    return lineProduct?.quantity ?? 0;
  }

  trackId(index: number, item: IProduct): number {
    return item.id!;
  }

  addToCart(product: IProduct): void {
    // If the cart is not defined, it shouldn't even be possible to add a product to it.
    if (this.cart == null) {
      return;
    }
    this.productToCartService.create(product.id!).subscribe((res: HttpResponse<IProductCart>) => {
      // Update the cart
      const productCartToUpdate: IProductCart | null = res.body ?? null;
      if (productCartToUpdate != null) {
        this.cart!.lines?.push(productCartToUpdate);
      }
      this.buildCartContentMap();
    });
  }

  deleteProduct(product: IProduct): void {
    const lineProduct: IProductCart | undefined = this.getProductCart(product);
    if (lineProduct?.id != null) {
      this.cartService.queryDeleteProductCart(lineProduct.id).subscribe(() => {
        // Reload component
        if (this.cart?.lines != null) {
          const indexProductCart = this.cart.lines.indexOf(lineProduct);
          // Splice is a method to delete starting from <index> a given <number of elements>.
          this.cart.lines.splice(indexProductCart, 1);
          this.buildCartContentMap();
        }
      });
    }
  }
}
