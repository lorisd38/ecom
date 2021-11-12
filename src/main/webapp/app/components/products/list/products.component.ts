import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ProductToCartService } from '../service/product-to-cart.service';

@Component({
  selector: 'jhi-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  products?: IProduct[];
  isLoading = false;

  constructor(
    protected productService: ProductService,
    protected modalService: NgbModal,
    protected productToCartService: ProductToCartService
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.productService.query().subscribe(
      (res: HttpResponse<IProduct[]>) => {
        this.isLoading = false;
        this.products = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
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
      this.productToCartService.create(product.id);
    }
  }
}
