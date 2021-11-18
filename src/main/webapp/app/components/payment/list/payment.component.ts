import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
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

  /*
  loadPrice(): void{
    this.paymentService.getTotalPrice(1).subscribe(
       (res: HttpResponse<number>) => {
            this.isLoading = false;
            if(res.body != null){
              this.totalPrice = res.body;
              this.finalPrice = this.totalPrice
            }

       },
       () => {
         this.isLoading = false;
       }
    );
  }
  */

  ngOnInit(): void {
    //this.loadPrice();
    this.totalPrice = this.paymentService.getTotalPrice(1);
    this.finalPrice = this.totalPrice;
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }

  getFinalPrice(): number {
    return this.finalPrice;
  }

  useCode(): void {
    const code: string = this.paymentForm.get('code')!.value;
    if (this.codeUsed === code) {
      this.finalPrice = this.totalPrice * this.paymentService.getReduction(code);
      this.codeUsed = code;
    }
  }
}
