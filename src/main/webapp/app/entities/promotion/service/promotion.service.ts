import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPromotion, getPromotionIdentifier } from '../promotion.model';

export type EntityResponseType = HttpResponse<IPromotion>;
export type EntityArrayResponseType = HttpResponse<IPromotion[]>;

@Injectable({ providedIn: 'root' })
export class PromotionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/promotions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(promotion: IPromotion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(promotion);
    return this.http
      .post<IPromotion>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(promotion: IPromotion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(promotion);
    return this.http
      .put<IPromotion>(`${this.resourceUrl}/${getPromotionIdentifier(promotion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(promotion: IPromotion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(promotion);
    return this.http
      .patch<IPromotion>(`${this.resourceUrl}/${getPromotionIdentifier(promotion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPromotion>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPromotion[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPromotionToCollectionIfMissing(
    promotionCollection: IPromotion[],
    ...promotionsToCheck: (IPromotion | null | undefined)[]
  ): IPromotion[] {
    const promotions: IPromotion[] = promotionsToCheck.filter(isPresent);
    if (promotions.length > 0) {
      const promotionCollectionIdentifiers = promotionCollection.map(promotionItem => getPromotionIdentifier(promotionItem)!);
      const promotionsToAdd = promotions.filter(promotionItem => {
        const promotionIdentifier = getPromotionIdentifier(promotionItem);
        if (promotionIdentifier == null || promotionCollectionIdentifiers.includes(promotionIdentifier)) {
          return false;
        }
        promotionCollectionIdentifiers.push(promotionIdentifier);
        return true;
      });
      return [...promotionsToAdd, ...promotionCollection];
    }
    return promotionCollection;
  }

  protected convertDateFromClient(promotion: IPromotion): IPromotion {
    return Object.assign({}, promotion, {
      startDate: promotion.startDate?.isValid() ? promotion.startDate.toJSON() : undefined,
      endDate: promotion.endDate?.isValid() ? promotion.endDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate ? dayjs(res.body.startDate) : undefined;
      res.body.endDate = res.body.endDate ? dayjs(res.body.endDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((promotion: IPromotion) => {
        promotion.startDate = promotion.startDate ? dayjs(promotion.startDate) : undefined;
        promotion.endDate = promotion.endDate ? dayjs(promotion.endDate) : undefined;
      });
    }
    return res;
  }
}
