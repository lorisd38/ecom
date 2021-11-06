import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPromotion } from '../promotion.model';
import { PromotionService } from '../service/promotion.service';
import { PromotionDeleteDialogComponent } from '../delete/promotion-delete-dialog.component';

@Component({
  selector: 'jhi-promotion',
  templateUrl: './promotion.component.html',
})
export class PromotionComponent implements OnInit {
  promotions?: IPromotion[];
  isLoading = false;

  constructor(protected promotionService: PromotionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.promotionService.query().subscribe(
      (res: HttpResponse<IPromotion[]>) => {
        this.isLoading = false;
        this.promotions = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPromotion): number {
    return item.id!;
  }

  delete(promotion: IPromotion): void {
    const modalRef = this.modalService.open(PromotionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.promotion = promotion;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
