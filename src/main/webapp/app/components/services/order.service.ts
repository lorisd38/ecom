import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../core/request/request-util';
import { IOrder } from '../../entities/order/order.model';
import { map } from 'rxjs/operators';
import { EntityArrayResponseType } from '../../entities/order/service/order.service';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from '../../core/config/application-config.service';
import * as dayjs from 'dayjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/orders/user');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((order: IOrder) => {
        order.paymentDate = order.paymentDate ? dayjs(order.paymentDate) : undefined;
        order.receptionDate = order.receptionDate ? dayjs(order.receptionDate) : undefined;
      });
    }
    return res;
  }
}
