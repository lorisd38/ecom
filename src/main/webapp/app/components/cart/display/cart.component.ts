import { Component, OnInit } from '@angular/core';
import { ICart } from 'app/entities/cart/cart.model';
import { IProductCart } from 'app/entities/product-cart/product-cart.model';
import { HttpResponse } from '@angular/common/http';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'jhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  isLoading = false;

  constructor(public cartService: CartService) {
    // do nothing.
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;
    this.cartService.queryOneCart().subscribe(
      (res: HttpResponse<ICart>) => {
        this.isLoading = false;
        this.cartService.cart = res.body ?? null;
        this.cartService.buildCartContentMap();
        this.cartService.calcTotal();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  trackId(index: number, item: IProductCart): number {
    return item.id!;
  }

  previousState(): void {
    window.history.back();
  }
}
