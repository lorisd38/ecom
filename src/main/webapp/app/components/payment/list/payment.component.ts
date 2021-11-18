import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';

import { PaymentService } from 'app/components/payment/service/payment.service';

@Component({
  selector: 'jhi-payment',
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
  totalPrice = -1;
  finalPrice = -1;
  codeUsed = '';
  isLoading = true;

  paymentForm = this.fb.group({
    code: [null, [Validators.required]],
  });

  constructor(protected paymentService: PaymentService, protected modalService: NgbModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    // this.totalPrice
    this.finalPrice = this.totalPrice;
  }

  useCode(): void {
    const code: string = this.paymentForm.get('code')!.value;
    if (this.codeUsed === code) {
      this.finalPrice = this.totalPrice * this.paymentService.getReduction(code);
      this.codeUsed = code;
    }
  }
}
