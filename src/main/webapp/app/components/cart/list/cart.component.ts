import { Component, OnInit } from '@angular/core';
import {Cart, ICart} from "../../../entities/cart/cart.model";

@Component({
  selector: 'jhi-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent  {
  cart?: ICart = new Cart(1,[]);

  constructor() {
    // do nothing.
  }


}
