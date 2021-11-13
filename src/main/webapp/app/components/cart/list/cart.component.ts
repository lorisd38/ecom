import { Component, OnInit } from '@angular/core';
import {Cart, ICart} from "../../../entities/cart/cart.model";
import {IProduct, Product} from "../../../entities/product/product.model";
import {IProductCart, ProductCart} from "../../../entities/product-cart/product-cart.model";
import {CartService} from "../../../entities/cart/service/cart.service";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'jhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{
  cart?: ICart|null = new Cart(1,[]);
  isLoading = false;

  constructor(public cartService: CartService) {
    // do nothing.
  }

  ngOnInit(): void {
    this.loadAll();
    /*     Test du Front
      const product: IProduct = new Product(4,"Orange","Description","France","Marque","PHOTO",3);
      const productCart: IProductCart = new ProductCart(1,33,product);
      this.cart = new Cart(1,[productCart]);
    */
  }

  loadAll(): void {
    this.isLoading=true;

    this.cartService.queryOneCart().subscribe(
      (res: HttpResponse<ICart>) => {
        this.isLoading = false;
        this.cart = res.body ?? null;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  delete(product: IProductCart):void{
    // TODO: delete product from cart
    console.error("Hello delete!");
  }

  trackId(index: number, item: IProductCart): number {
    return item.id!;
  }
}
