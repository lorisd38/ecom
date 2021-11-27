import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPromotionalCode } from '../promotional-code.model';
import { PromotionalCodeService } from '../service/promotional-code.service';

@Component({
  templateUrl: './promotional-code-delete-dialog.component.html',
})
export class PromotionalCodeDeleteDialogComponent {
  promotionalCode?: IPromotionalCode;

  constructor(protected promotionalCodeService: PromotionalCodeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.promotionalCodeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
