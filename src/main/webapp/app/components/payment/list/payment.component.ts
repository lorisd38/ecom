import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { CartService } from 'app/components/cart/service/cart.service';

import { PaymentService } from 'app/components/payment/service/payment.service';
import { getTotalCartPrice, ICart } from 'app/entities/cart/cart.model';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-payment',
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
  cart?: ICart | null;
  totalPrice = '0';
  finalPrice = '0';
  codeUsed = '';
  isLoading = true;

  paymentForm = this.fb.group({
    code: [null, [Validators.required]],
  });

  constructor(
    protected paymentService: PaymentService,
    protected cartService: CartService,
    protected modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadAll();
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

  useCode(): void {
    /* const code: string = this.paymentForm.get('code')!.value;

    if (this.codeUsed === code) {
      this.finalPrice = this.totalPrice * this.paymentService.getReduction(code);
      this.codeUsed = code;
    }
    */
  }
}
