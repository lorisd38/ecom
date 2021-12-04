import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ProductToCartService } from '../service/product-to-cart.service';
import { ICart } from 'app/entities/cart/cart.model';
import { CartService } from '../../cart/service/cart.service';
import { AccountService } from 'app/core/auth/account.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'jhi-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  products?: IProduct[];
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
    console.log('HERE');
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params.query !== undefined && params.query !== '') {
        this.query = params.query;
        this.loadProductSearch();
      } else {
        this.query = '';
        this.loadProduct();
      }
      this.accountService.getAuthenticationState().subscribe(account => {
        if (account != null) {
          this.loadCart();
          this.loadFavorites();
        } else {
          this.productToCartService.cart = null;
          this.productToCartService.productsMap.clear();
          this.cartService.nbItems = 0;
          this.productService.listFavorites = null;
        }
      });
    });
  }

  loadProductSearch(): void {
    this.query
      ? this.productService.querySearch(this.query).subscribe((res: HttpResponse<IProduct[]>) => {
          this.products = res.body ?? [];
        })
      : '';
  }

  loadProduct(): void {
    this.productService.query().subscribe((res: HttpResponse<IProduct[]>) => {
      this.products = res.body ?? [];
    });
  }

  loadCart(): void {
    this.cartService.queryOneCart().subscribe((res: HttpResponse<ICart>) => {
      this.productToCartService.cart = res.body ?? null;
      this.cartService.cart = res.body ?? null;
      this.productToCartService.buildCartContentMap();
      this.cartService.calcTotal();
    });
  }

  loadFavorites(): void {
    this.productService.getFavorites().subscribe((res: HttpResponse<IProduct[]>) => {
      this.productService.listFavorites = res.body ?? null;
    });
  }
}
