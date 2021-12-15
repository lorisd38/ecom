import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  message?: string;

  constructor(protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirm(): void {
    this.activeModal.close('confirmed');
  }
}
