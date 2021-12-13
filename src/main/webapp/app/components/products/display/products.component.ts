import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IProduct } from 'app/entities/product/product.model';
import { ICart } from 'app/entities/cart/cart.model';
import { CartService } from '../../services/cart.service';
import { AccountService } from 'app/core/auth/account.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { FilterService } from '../../services/filter.service';
import { PromotionService } from '../../services/promotion.service';

@Component({
  selector: 'jhi-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  listProducts?: IProduct[];
  products?: IProduct[];

  public query: string | null = '';
  private category: string | null = '';
  private tagsIdSelected?: number[];

  constructor(
    protected productService: ProductService,
    protected modalService: NgbModal,
    public cartService: CartService,
    public filterService: FilterService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private promotionService: PromotionService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params.filter !== undefined && params.filter !== '') {
        this.tagsIdSelected = params.filter;
      }
      if (params.query !== undefined && params.query !== '') {
        this.query = params.query;
        this.loadProductSearch();
      } else if (params.category !== undefined && params.category !== '') {
        this.category = params.category;
        this.loadProductCategories();
      } else {
        this.query = '';
        this.loadProduct();
      }
      this.accountService.getAuthenticationState().subscribe(account => {
        if (account != null) {
          this.loadCart();
          this.productService.loadFavorites();
        } else {
          this.cartService.cart = null;
          this.cartService.productsMap.clear();
          this.cartService.nbItems = 0;
          this.productService.listFavorites = null;
        }
      });
    });
  }

  loadProductSearch(): void {
    this.query
      ? this.productService.querySearch(this.query, this.tagsIdSelected!.toString()).subscribe((res: HttpResponse<IProduct[]>) => {
          this.listProducts = res.body ?? [];
          this.products = this.listProducts;
        })
      : '';
  }

  loadProductCategories(): void {
    if (this.category) {
      this.productService.queryByCategory(this.category, this.tagsIdSelected!.toString()).subscribe((res: HttpResponse<IProduct[]>) => {
        this.listProducts = res.body ?? [];
        this.products = this.listProducts;
      });
    }
  }

  loadProduct(): void {
    this.promotionService.query(this.tagsIdSelected).subscribe(res => {
      this.promotionService.promotions = res.body;
      if (this.promotionService.promotions) {
        this.listProducts = this.promotionService.getProductsPromotion();
        this.products = this.listProducts;
      }
    });
  }

  loadCart(): void {
    this.cartService.queryOneCart().subscribe((res: HttpResponse<ICart>) => {
      this.cartService.cart = res.body ?? null;
      this.cartService.buildCartContentMap();
      this.cartService.calcTotal();
    });
  }
}
