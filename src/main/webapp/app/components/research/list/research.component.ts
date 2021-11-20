import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {IProduct} from "../../../entities/product/product.model";
import {Account} from "../../../core/auth/account.model";
import {IProductCart} from "../../../entities/product-cart/product-cart.model";
import {HttpResponse} from "@angular/common/http";
import {ICart} from "../../../entities/cart/cart.model";
import {ProductToCartService} from "../../products/service/product-to-cart.service";
import {CartService} from "../../cart/service/cart.service";
import {AccountService} from "../../../core/auth/account.service";
import {ProductService} from "../../../entities/product/service/product.service";

@Component({
  selector: 'jhi-research',
  templateUrl: './research.component.html'
})
export class ResearchComponent implements OnInit {
  public query: string | null = "";
  public products?: IProduct[] = [];
  productsPresent: number[] = [];
  account: Account | null = null;
  cart?: ICart | null;
  isLoading = false;


  constructor(
    private activatedRoute: ActivatedRoute,
    protected productToCartService: ProductToCartService,
    public cartService: CartService,
    private accountService: AccountService,
    protected productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log("Le parametre est :",params.q);
      this.query = params.q;
      this.loadProductSearch()
    });

    this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
  }

  loadProductSearch(): void {
    this.isLoading = true;
    this.query?
    this.productService.querySearch(this.query).subscribe(
      (res: HttpResponse<IProduct[]>) => {
        this.products = res.body ?? [];
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    ):"";
  }

  trackId(index: number, item: IProduct): number {
    return item.id!;
  }

  isPresent(itemId?: number): boolean {
    return itemId != null ? this.productsPresent.includes(itemId) : false;
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


  buildCartContentArray(): void {
    this.productsPresent = [];
    if (this.cart?.lines != null) {
      for (const lineProduct of this.cart.lines) {
        if (lineProduct.product?.id != null) {
          this.productsPresent.push(lineProduct.product.id);
        }
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

}
