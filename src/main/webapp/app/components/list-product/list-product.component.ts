import {Component, Input} from '@angular/core';
import {IProduct} from "../../entities/product/product.model";

@Component({
  selector: 'jhi-list-product',
  templateUrl: './list-product.component.html',
})
export class ListProductComponent {
  @Input() products: IProduct[] | undefined = [];

  trackId(index: number, item: IProduct): number {
    return item.id!;
  }
}
