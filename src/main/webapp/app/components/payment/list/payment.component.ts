import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, Validators} from '@angular/forms';
import {CartService} from 'app/components/cart/service/cart.service';

import {PaymentService} from 'app/components/payment/service/payment.service';
import {getProductQuantity, getTotalCartPrice, ICart} from 'app/entities/cart/cart.model';
import {HttpResponse} from '@angular/common/http';
import {IOrder, Order} from '../../../entities/order/order.model';
import * as dayjs from 'dayjs';
import {DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT} from '../../../config/input.constants';
import {IPromotionalCode} from "../../../entities/promotional-code/promotional-code.model";
import {ReductionType} from "../../../entities/enumerations/reduction-type.model";

@Component({
  selector: 'jhi-payment',
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
  cart?: ICart | null;
  promoCode?: IPromotionalCode | null;
  totalPrice = '0';
  totalSaved = '0';
  codeUsed = '';
  isLoading = true;
  isSaving = false;

  editForm = this.fb.group({
    receptionDate: [null, [Validators.required]],
    receptionTime: [null, [Validators.required]],
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
  }

  calcTotalSaved(): void {
    if (this.promoCode == null || this.cart == null) {
      this.totalSaved = '0';
      return;
    }
    let total = 0;
    if (this.promoCode.unit === ReductionType.FIX) {
      this.promoCode.products!.forEach(p => {
        total += this.promoCode!.value! * getProductQuantity(this.cart, p.id!);
      })
    } else if (this.promoCode.unit === ReductionType.PERCENTAGE) {
      const percentage: number = this.promoCode.value!/100;
      this.promoCode.products!.forEach(p => {
        total += p.price! * percentage * getProductQuantity(this.cart, p.id!);
      })
    }
    this.totalSaved = total.toString();
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

  applyPromoCode(): void {
    this.paymentService.findPromoCode(this.editForm.get(['promoCode'])!.value, true).subscribe((res: HttpResponse<IPromotionalCode>) => {
        this.isLoading = false;
        this.promoCode = res.body ?? null;
        console.log(this.promoCode);
        this.calcTotalSaved();
      },
      () => {
        this.isLoading = false;
      });
  }

  protected updateForm(order: IOrder): void {
    this.editForm.patchValue({
      receptionDate: order.receptionDate ? order.receptionDate.format(DATE_FORMAT) : null,
      receptionTime: order.receptionDate ? order.receptionDate.format(TIME_FORMAT) : null,
      //promoCode: order.promoCode,
    });
  }

  protected createFromForm(): IOrder {
    return {
      ...new Order(),
      receptionDate: this.editForm.get(['receptionDate'])!.value
        ? dayjs(`${String(this.editForm.get(['receptionDate'])!.value)}T${String(this.editForm.get(['receptionTime'])!.value)}`, DATE_TIME_FORMAT)
        : undefined,
      // promoCode: this.editForm.get(['promoCode'])!.value,
    };
  }
}
