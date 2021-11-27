import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPromotionalCode } from '../promotional-code.model';
import { PromotionalCodeService } from '../service/promotional-code.service';
import { PromotionalCodeDeleteDialogComponent } from '../delete/promotional-code-delete-dialog.component';

@Component({
  selector: 'jhi-promotional-code',
  templateUrl: './promotional-code.component.html',
})
export class PromotionalCodeComponent implements OnInit {
  promotionalCodes?: IPromotionalCode[];
  isLoading = false;

  constructor(protected promotionalCodeService: PromotionalCodeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.promotionalCodeService.query().subscribe(
      (res: HttpResponse<IPromotionalCode[]>) => {
        this.isLoading = false;
        this.promotionalCodes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPromotionalCode): number {
    return item.id!;
  }

  delete(promotionalCode: IPromotionalCode): void {
    const modalRef = this.modalService.open(PromotionalCodeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.promotionalCode = promotionalCode;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
