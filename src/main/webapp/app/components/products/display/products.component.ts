import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IProduct } from 'app/entities/product/product.model';
import { ICart } from 'app/entities/cart/cart.model';
import { CartService } from '../../services/cart.service';
import { AccountService } from 'app/core/auth/account.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { PromotionService } from '../../services/promotion.service';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'jhi-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  public title: string | undefined = 'Products';
  products?: IProduct[];
  public query: string | null = '';
  public nbQuery: number | undefined = 0;
  public sortBy: string | null = 'name';
  public sortOrder: string | null = 'ASC';
  private category: string | null = '';

  constructor(
    protected productService: ProductService,
    protected modalService: NgbModal,
    public cartService: CartService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private promotionService: PromotionService,
    public categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params.query !== undefined && params.query !== '') {
        this.query = params.query;
        this.loadProductSearch();
      } else if (params.category !== undefined && params.category !== '') {
        this.title = this.categoriesService.listCategory[Number(params.category) - 1].name;
        this.category = params.category;
        this.loadProductCategories();
      } else {
        this.title = 'Promotions';
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
      ? this.productService.querySearch(this.query, this.sortBy, this.sortOrder).subscribe((res: HttpResponse<IProduct[]>) => {
          this.products = res.body ?? [];
          this.nbQuery = res.body?.length;
        })
      : '';
  }

  loadProductCategories(): void {
    if (this.category) {
      this.productService.queryByCategory(this.category, this.sortBy, this.sortOrder).subscribe((res: HttpResponse<IProduct[]>) => {
        this.products = res.body ?? [];
      });
    }
  }

  loadProduct(): void {
    if (this.promotionService.getPromotions() != null) {
      this.actOnPromotions();
    } else {
      this.promotionService.promotionsObs.subscribe(promotions => {
        this.actOnPromotions();
      });
    }
  }

  getPricePromo(promo: any, price?: number): number {
    let res = 0;
    const subPromo = Number(promo.substr(1, promo.length - 2));

    if (promo.substr(promo.length - 1) === '%') {
      res = price! - (price! * subPromo) / 100;
    } else {
      res = price! - subPromo;
    }

    return res;
  }

  loadCart(): void {
    this.cartService.queryOneCart().subscribe((res: HttpResponse<ICart>) => {
      this.cartService.cart = res.body ?? null;
      this.cartService.buildCartContentMap();
      this.cartService.calcTotal();
    });
  }

  changeSort(sortBy: string, sortOrder: string): void {
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    this.ngOnInit();
  }

  private actOnPromotions(): void {
    this.products = this.promotionService.getProductsPromotion();
    if (this.sortBy === 'name') {
      this.products.sort((a, b) => {
        if (a.name! > b.name!) {
          if (this.sortOrder === 'DESC') {
            return -1;
          }
          return 1;
        }
        if (a.name! < b.name!) {
          if (this.sortOrder === 'DESC') {
            return 1;
          }
          return -1;
        }
        return 0;
      });
    } else if (this.sortBy === 'price') {
      if (this.sortOrder === 'ASC') {
        this.products.sort(
          (a, b) =>
            this.getPricePromo(this.promotionService.getPromotion(a), a.price) -
            this.getPricePromo(this.promotionService.getPromotion(b), b.price)
        );
      } else {
        this.products.sort(
          (a, b) =>
            this.getPricePromo(this.promotionService.getPromotion(b), b.price) -
            this.getPricePromo(this.promotionService.getPromotion(a), a.price)
        );
      }
    }
  }
}
