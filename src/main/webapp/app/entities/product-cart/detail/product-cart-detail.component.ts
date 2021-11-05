import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductCart } from '../product-cart.model';

@Component({
  selector: 'jhi-product-cart-detail',
  templateUrl: './product-cart-detail.component.html',
})
export class ProductCartDetailComponent implements OnInit {
  productCart: IProductCart | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productCart }) => {
      this.productCart = productCart;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
