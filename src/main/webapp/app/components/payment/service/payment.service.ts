import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IOrder } from '../../../entities/order/order.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityArrayResponseType, EntityResponseType } from '../../../entities/order/service/order.service';
import * as dayjs from 'dayjs';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/orders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(order: IOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(order);
    return this.http
      .post<IOrder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  protected convertDateFromClient(order: IOrder): IOrder {
    return Object.assign({}, order, {
      paymentDate: undefined,
      receptionDate: order.receptionDate?.isValid() ? order.receptionDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.paymentDate = res.body.paymentDate ? dayjs(res.body.paymentDate) : undefined;
      res.body.receptionDate = res.body.receptionDate ? dayjs(res.body.receptionDate) : undefined;
    }
    return res;
  }
}
