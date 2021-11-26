import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPromotion, Promotion } from '../promotion.model';
import { PromotionService } from '../service/promotion.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ReductionType } from 'app/entities/enumerations/reduction-type.model';

@Component({
  selector: 'jhi-promotion-update',
  templateUrl: './promotion-update.component.html',
})
export class PromotionUpdateComponent implements OnInit {
  isSaving = false;
  reductionTypeValues = Object.keys(ReductionType);

  productsSharedCollection: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    startDate: [null, [Validators.required]],
    endDate: [null, [Validators.required]],
    value: [null, [Validators.required]],
    unit: [null, [Validators.required]],
    products: [],
  });

  constructor(
    protected promotionService: PromotionService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ promotion }) => {
      if (promotion.id === undefined) {
        const today = dayjs().startOf('day');
        promotion.startDate = today;
        promotion.endDate = today;
      }

      this.updateForm(promotion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const promotion = this.createFromForm();
    if (promotion.id !== undefined) {
      this.subscribeToSaveResponse(this.promotionService.update(promotion));
    } else {
      this.subscribeToSaveResponse(this.promotionService.create(promotion));
    }
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  getSelectedProduct(option: IProduct, selectedVals?: IProduct[]): IProduct {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPromotion>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(promotion: IPromotion): void {
    this.editForm.patchValue({
      id: promotion.id,
      startDate: promotion.startDate ? promotion.startDate.format(DATE_TIME_FORMAT) : null,
      endDate: promotion.endDate ? promotion.endDate.format(DATE_TIME_FORMAT) : null,
      value: promotion.value,
      unit: promotion.unit,
      products: promotion.products,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      ...(promotion.products ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) =>
          this.productService.addProductToCollectionIfMissing(products, ...(this.editForm.get('products')!.value ?? []))
        )
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));
  }

  protected createFromForm(): IPromotion {
    return {
      ...new Promotion(),
      id: this.editForm.get(['id'])!.value,
      startDate: this.editForm.get(['startDate'])!.value ? dayjs(this.editForm.get(['startDate'])!.value, DATE_TIME_FORMAT) : undefined,
      endDate: this.editForm.get(['endDate'])!.value ? dayjs(this.editForm.get(['endDate'])!.value, DATE_TIME_FORMAT) : undefined,
      value: this.editForm.get(['value'])!.value,
      unit: this.editForm.get(['unit'])!.value,
      products: this.editForm.get(['products'])!.value,
    };
  }
}
