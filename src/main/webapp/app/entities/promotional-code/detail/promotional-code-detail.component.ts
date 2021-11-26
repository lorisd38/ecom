import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPromotionalCode } from '../promotional-code.model';

@Component({
  selector: 'jhi-promotional-code-detail',
  templateUrl: './promotional-code-detail.component.html',
})
export class PromotionalCodeDetailComponent implements OnInit {
  promotionalCode: IPromotionalCode | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ promotionalCode }) => {
      this.promotionalCode = promotionalCode;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
