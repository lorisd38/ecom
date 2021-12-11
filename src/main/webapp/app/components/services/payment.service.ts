import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IOrder } from '../../entities/order/order.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import { IPromotionalCode } from '../../entities/promotional-code/promotional-code.model';

export type OrderEntityResponseType = HttpResponse<IOrder>;
export type PromoCodeEntityResponseType = HttpResponse<IPromotionalCode>;

@Injectable({ providedIn: 'root' })
export class PaymentService {
  protected orderResourceUrl = this.applicationConfigService.getEndpointFor('api/orders');
  protected promoCodeResourceUrl = this.applicationConfigService.getEndpointFor('api/promotional-codes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(order: IOrder): Observable<OrderEntityResponseType> {
    const copy = this.convertOrderDateFromClient(order);
    return this.http
      .post<IOrder>(this.orderResourceUrl, copy, { observe: 'response' })
      .pipe(map((res: OrderEntityResponseType) => this.convertOrderDateFromServer(res)));
  }

  findPromoCode(code: string, forCart: boolean): Observable<PromoCodeEntityResponseType> {
    const parameters = new HttpParams().set('forCart', forCart);
    return this.http
      .get<IPromotionalCode>(`${this.promoCodeResourceUrl}/codes/${code}`, { params: parameters, observe: 'response' })
      .pipe(map((res: PromoCodeEntityResponseType) => this.convertPromoCodeDateFromServer(res)));
  }

  protected convertOrderDateFromClient(order: IOrder): IOrder {
    return Object.assign({}, order, {
      paymentDate: undefined,
      receptionDate: order.receptionDate?.isValid() ? order.receptionDate.toJSON() : undefined,
    });
  }

  protected convertOrderDateFromServer(res: OrderEntityResponseType): OrderEntityResponseType {
    if (res.body) {
      res.body.paymentDate = res.body.paymentDate ? dayjs(res.body.paymentDate) : undefined;
      res.body.receptionDate = res.body.receptionDate ? dayjs(res.body.receptionDate) : undefined;
    }
    return res;
  }

  protected convertPromoCodeDateFromServer(res: PromoCodeEntityResponseType): PromoCodeEntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate ? dayjs(res.body.startDate) : undefined;
      res.body.endDate = res.body.endDate ? dayjs(res.body.endDate) : undefined;
    }
    return res;
  }
}
