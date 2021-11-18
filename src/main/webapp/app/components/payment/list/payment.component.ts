import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { CartService } from 'app/components/cart/service/cart.service';

import { PaymentService } from 'app/components/payment/service/payment.service';

@Component({
  selector: 'jhi-payment',
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
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

  ngOnInit(): void {
    loadAll();
  }

  calcTotal(): void {
    let tt = 0.0;
    if (this.cart?.lines != null) {
      for (const lineProduct of this.cart.lines) {
        if (lineProduct.quantity != null && lineProduct.product?.price != null) {
          tt += lineProduct.quantity * lineProduct.product.price;
        }
      }
    }
    this.totalPrice = tt.toLocaleString();
    this.finalPrice = tt.toLocaleString();
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }

  getFinalPrice(): number {
    return this.finalPrice;
  }

  useCode(): void {
    const code: string = this.paymentForm.get('code')!.value;
    /*
    if (this.codeUsed === code) {
      this.finalPrice = this.totalPrice * this.paymentService.getReduction(code);
      this.codeUsed = code;
    }
    */
  }
}
