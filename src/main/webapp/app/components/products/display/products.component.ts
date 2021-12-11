import { Component, HostListener, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IProduct } from 'app/entities/product/product.model';
import { ICart } from 'app/entities/cart/cart.model';
import { CartService } from '../../services/cart.service';
import { AccountService } from 'app/core/auth/account.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Observable, Subscriber } from 'rxjs';
import { Page } from '../../../shared/pagination/page.model';

@Component({
  selector: 'jhi-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  products: IProduct[] = [];
  public query: string | null = '';
  private category: string | null = '';

  private currentPage = 0;
  private maxPage = 0;
  private pageSubscriber: Subscriber<number> | undefined;
  private pageObs: Observable<number>;

  constructor(
    protected productService: ProductService,
    protected modalService: NgbModal,
    public cartService: CartService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute
  ) {
    this.pageObs = new Observable(subscriber => (this.pageSubscriber = subscriber));
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
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
      this.pageSubscriber?.next(0);

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

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    // In chrome and some browser scroll is given to body tag
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    const max = document.documentElement.scrollHeight;
    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if (pos / max >= 1.5 && this.currentPage < this.maxPage) {
      // Do your action here
      this.currentPage += 1;
      this.pageSubscriber!.next(this.currentPage);
    }
  }

  loadProductSearch(): void {
    console.log('here ', this.query);
    this.products = [];
    this.query
      ? this.productService.querySearch(this.query, this.currentPage).subscribe((res: HttpResponse<Page<IProduct>>) => {
          this.products = this.products.concat(res.body?.content ?? []);
          this.maxPage = res.body?.totalPages ?? 0;
        })
      : '';
  }

  loadProductCategories(): void {
    this.products = [];
    if (this.category) {
      this.productService.queryByCategory(this.category, this.currentPage).subscribe((res: HttpResponse<Page<IProduct>>) => {
        this.products = this.products.concat(res.body?.content ?? []);
        this.maxPage = res.body?.totalPages ?? 0;
      });
    }
  }

  loadProduct(): void {
    this.products = [];
    this.pageObs.subscribe(value => {
      this.productService.query(value).subscribe((res: HttpResponse<Page<IProduct>>) => {
        this.products = this.products.concat(res.body?.content ?? []);
        this.maxPage = res.body?.totalPages ?? 0;
      });
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
