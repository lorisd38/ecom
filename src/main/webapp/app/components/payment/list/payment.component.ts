import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { CartService } from 'app/components/cart/service/cart.service';

import { PaymentService } from 'app/components/payment/service/payment.service';
import { getTotalCartPrice, ICart } from 'app/entities/cart/cart.model';
import { HttpResponse } from '@angular/common/http';
import { IOrder, Order } from '../../../entities/order/order.model';
import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from '../../../config/input.constants';

@Component({
  selector: 'jhi-payment',
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
  cart?: ICart | null;
  totalPrice = '0';
  codeUsed = '';
  isLoading = true;
  isSaving = false;

  editForm = this.fb.group({
    receptionDate: [null, [Validators.required]],
    promoCode: [null, [Validators.required]],
    cbName: [null, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
    cbNumber: [null, [Validators.required]],
    cbExpirationDate: [null, [Validators.required]],
    cbCVC: [null, [Validators.required]],
  });

  constructor(
    protected paymentService: PaymentService,
    protected cartService: CartService,
    protected modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadAll();
    const order: IOrder = new Order();
    const today = dayjs().startOf('day').add(1, 'day').add(12, 'hour');
    order.paymentDate = today;
    order.receptionDate = today;
    this.updateForm(order);
  }

  loadAll(): void {
    this.isLoading = true;

    this.cartService.queryOneCart().subscribe(
      (res: HttpResponse<ICart>) => {
        this.isLoading = false;
        this.cart = res.body ?? null;
        this.calcTotal();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  calcTotal(): void {
    this.totalPrice = getTotalCartPrice(this.cart).toLocaleString();
    // TODO Use promo code here.
  }

  generateOrder(): void {
    /* const code: string = this.paymentForm.get('code')!.value;

    if (this.codeUsed === code) {
      this.finalPrice = this.totalPrice * this.paymentService.getReduction(code);
      this.codeUsed = code;
    }
    */
  }

  previousState(): void {
    window.history.back();
  }

  protected updateForm(order: IOrder): void {
    this.editForm.patchValue({
      receptionDate: order.receptionDate ? order.receptionDate.format(DATE_TIME_FORMAT) : null,
      // promoCode: order.promoCode,
    });
  }

  protected createFromForm(): IOrder {
    return {
      ...new Order(),
      receptionDate: this.editForm.get(['receptionDate'])!.value
        ? dayjs(this.editForm.get(['receptionDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      // promoCode: this.editForm.get(['promoCode'])!.value,
    };
  }
}
