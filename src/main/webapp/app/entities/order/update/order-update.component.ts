import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOrder, Order } from '../order.model';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'jhi-order-update',
  templateUrl: './order-update.component.html',
})
export class OrderUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    paymentDate: [null, [Validators.required]],
    receptionDate: [null, [Validators.required]],
    promoCode: [],
    totalPrice: [null, [Validators.required]],
  });

  constructor(protected orderService: OrderService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      if (order.id === undefined) {
        const today = dayjs().startOf('day');
        order.paymentDate = today;
        order.receptionDate = today;
      }

      this.updateForm(order);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const order = this.createFromForm();
    if (order.id !== undefined) {
      this.subscribeToSaveResponse(this.orderService.update(order));
    } else {
      this.subscribeToSaveResponse(this.orderService.create(order));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
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

  protected updateForm(order: IOrder): void {
    this.editForm.patchValue({
      id: order.id,
      paymentDate: order.paymentDate ? order.paymentDate.format(DATE_TIME_FORMAT) : null,
      receptionDate: order.receptionDate ? order.receptionDate.format(DATE_TIME_FORMAT) : null,
      promoCode: order.promoCode,
      totalPrice: order.totalPrice,
    });
  }

  protected createFromForm(): IOrder {
    return {
      ...new Order(),
      id: this.editForm.get(['id'])!.value,
      paymentDate: this.editForm.get(['paymentDate'])!.value
        ? dayjs(this.editForm.get(['paymentDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      receptionDate: this.editForm.get(['receptionDate'])!.value
        ? dayjs(this.editForm.get(['receptionDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      promoCode: this.editForm.get(['promoCode'])!.value,
      totalPrice: this.editForm.get(['totalPrice'])!.value,
    };
  }
}
