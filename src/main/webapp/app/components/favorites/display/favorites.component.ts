import { Component } from '@angular/core';
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'jhi-favorites',
  templateUrl: './favorites.component.html',
})
export class FavoritesComponent{

  constructor(public productService: ProductService) {
  }
}
