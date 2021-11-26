import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPromotionalCode, PromotionalCode } from '../promotional-code.model';
import { PromotionalCodeService } from '../service/promotional-code.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ReductionType } from 'app/entities/enumerations/reduction-type.model';

@Component({
  selector: 'jhi-promotional-code-update',
  templateUrl: './promotional-code-update.component.html',
})
export class PromotionalCodeUpdateComponent implements OnInit {
  isSaving = false;
  reductionTypeValues = Object.keys(ReductionType);

  productsSharedCollection: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    startDate: [null, [Validators.required]],
    endDate: [null, [Validators.required]],
    value: [null, [Validators.required]],
    unit: [null, [Validators.required]],
    products: [],
  });

  constructor(
    protected promotionalCodeService: PromotionalCodeService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ promotionalCode }) => {
      if (promotionalCode.id === undefined) {
        const today = dayjs().startOf('day');
        promotionalCode.startDate = today;
        promotionalCode.endDate = today;
      }

      this.updateForm(promotionalCode);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const promotionalCode = this.createFromForm();
    if (promotionalCode.id !== undefined) {
      this.subscribeToSaveResponse(this.promotionalCodeService.update(promotionalCode));
    } else {
      this.subscribeToSaveResponse(this.promotionalCodeService.create(promotionalCode));
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPromotionalCode>>): void {
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

  protected updateForm(promotionalCode: IPromotionalCode): void {
    this.editForm.patchValue({
      id: promotionalCode.id,
      code: promotionalCode.code,
      startDate: promotionalCode.startDate ? promotionalCode.startDate.format(DATE_TIME_FORMAT) : null,
      endDate: promotionalCode.endDate ? promotionalCode.endDate.format(DATE_TIME_FORMAT) : null,
      value: promotionalCode.value,
      unit: promotionalCode.unit,
      products: promotionalCode.products,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      ...(promotionalCode.products ?? [])
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

  protected createFromForm(): IPromotionalCode {
    return {
      ...new PromotionalCode(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      startDate: this.editForm.get(['startDate'])!.value ? dayjs(this.editForm.get(['startDate'])!.value, DATE_TIME_FORMAT) : undefined,
      endDate: this.editForm.get(['endDate'])!.value ? dayjs(this.editForm.get(['endDate'])!.value, DATE_TIME_FORMAT) : undefined,
      value: this.editForm.get(['value'])!.value,
      unit: this.editForm.get(['unit'])!.value,
      products: this.editForm.get(['products'])!.value,
    };
  }
}
