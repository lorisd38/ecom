import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductCart } from '../product-cart.model';
import { ProductCartService } from '../service/product-cart.service';

@Component({
  templateUrl: './product-cart-delete-dialog.component.html',
})
export class ProductCartDeleteDialogComponent {
  productCart?: IProductCart;

  constructor(protected productCartService: ProductCartService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productCartService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
