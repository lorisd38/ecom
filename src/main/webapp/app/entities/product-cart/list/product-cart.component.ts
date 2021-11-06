import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductCart } from '../product-cart.model';
import { ProductCartService } from '../service/product-cart.service';
import { ProductCartDeleteDialogComponent } from '../delete/product-cart-delete-dialog.component';

@Component({
  selector: 'jhi-product-cart',
  templateUrl: './product-cart.component.html',
})
export class ProductCartComponent implements OnInit {
  productCarts?: IProductCart[];
  isLoading = false;

  constructor(protected productCartService: ProductCartService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.productCartService.query().subscribe(
      (res: HttpResponse<IProductCart[]>) => {
        this.isLoading = false;
        this.productCarts = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProductCart): number {
    return item.id!;
  }

  delete(productCart: IProductCart): void {
    const modalRef = this.modalService.open(ProductCartDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.productCart = productCart;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
