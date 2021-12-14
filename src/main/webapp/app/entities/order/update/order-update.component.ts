import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOrder, Order } from '../order.model';
import { OrderService } from '../service/order.service';
import { IPromotionalCode } from 'app/entities/promotional-code/promotional-code.model';
import { PromotionalCodeService } from 'app/entities/promotional-code/service/promotional-code.service';
import { IUserDetails } from 'app/entities/user-details/user-details.model';
import { UserDetailsService } from 'app/entities/user-details/service/user-details.service';

@Component({
  selector: 'jhi-order-update',
  templateUrl: './order-update.component.html',
})
export class OrderUpdateComponent implements OnInit {
  isSaving = false;

  promotionalCodesSharedCollection: IPromotionalCode[] = [];
  userDetailsSharedCollection: IUserDetails[] = [];

  editForm = this.fb.group({
    id: [],
    paymentDate: [null, [Validators.required]],
    receptionDate: [null, [Validators.required]],
    totalPrice: [null, [Validators.required]],
    promotionalCode: [],
    user: [],
  });

  constructor(
    protected orderService: OrderService,
    protected promotionalCodeService: PromotionalCodeService,
    protected userDetailsService: UserDetailsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      if (order.id === undefined) {
        const today = dayjs().startOf('day');
        order.paymentDate = today;
        order.receptionDate = today;
      }

      this.updateForm(order);

      this.loadRelationshipsOptions();
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

  trackPromotionalCodeById(index: number, item: IPromotionalCode): number {
    return item.id!;
  }

  trackUserDetailsById(index: number, item: IUserDetails): number {
    return item.id!;
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
      totalPrice: order.totalPrice,
      promotionalCode: order.promotionalCode,
      user: order.user,
    });

    this.promotionalCodesSharedCollection = this.promotionalCodeService.addPromotionalCodeToCollectionIfMissing(
      this.promotionalCodesSharedCollection,
      order.promotionalCode
    );
    this.userDetailsSharedCollection = this.userDetailsService.addUserDetailsToCollectionIfMissing(
      this.userDetailsSharedCollection,
      order.user
    );
  }

  protected loadRelationshipsOptions(): void {
    this.promotionalCodeService
      .query()
      .pipe(map((res: HttpResponse<IPromotionalCode[]>) => res.body ?? []))
      .pipe(
        map((promotionalCodes: IPromotionalCode[]) =>
          this.promotionalCodeService.addPromotionalCodeToCollectionIfMissing(promotionalCodes, this.editForm.get('promotionalCode')!.value)
        )
      )
      .subscribe((promotionalCodes: IPromotionalCode[]) => (this.promotionalCodesSharedCollection = promotionalCodes));

    this.userDetailsService
      .query()
      .pipe(map((res: HttpResponse<IUserDetails[]>) => res.body ?? []))
      .pipe(
        map((userDetails: IUserDetails[]) =>
          this.userDetailsService.addUserDetailsToCollectionIfMissing(userDetails, this.editForm.get('user')!.value)
        )
      )
      .subscribe((userDetails: IUserDetails[]) => (this.userDetailsSharedCollection = userDetails));
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
      totalPrice: this.editForm.get(['totalPrice'])!.value,
      promotionalCode: this.editForm.get(['promotionalCode'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
