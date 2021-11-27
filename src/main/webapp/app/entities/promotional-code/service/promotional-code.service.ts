import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPromotionalCode, getPromotionalCodeIdentifier } from '../promotional-code.model';

export type EntityResponseType = HttpResponse<IPromotionalCode>;
export type EntityArrayResponseType = HttpResponse<IPromotionalCode[]>;

@Injectable({ providedIn: 'root' })
export class PromotionalCodeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/promotional-codes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(promotionalCode: IPromotionalCode): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(promotionalCode);
    return this.http
      .post<IPromotionalCode>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(promotionalCode: IPromotionalCode): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(promotionalCode);
    return this.http
      .put<IPromotionalCode>(`${this.resourceUrl}/${getPromotionalCodeIdentifier(promotionalCode) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(promotionalCode: IPromotionalCode): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(promotionalCode);
    return this.http
      .patch<IPromotionalCode>(`${this.resourceUrl}/${getPromotionalCodeIdentifier(promotionalCode) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPromotionalCode>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPromotionalCode[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPromotionalCodeToCollectionIfMissing(
    promotionalCodeCollection: IPromotionalCode[],
    ...promotionalCodesToCheck: (IPromotionalCode | null | undefined)[]
  ): IPromotionalCode[] {
    const promotionalCodes: IPromotionalCode[] = promotionalCodesToCheck.filter(isPresent);
    if (promotionalCodes.length > 0) {
      const promotionalCodeCollectionIdentifiers = promotionalCodeCollection.map(
        promotionalCodeItem => getPromotionalCodeIdentifier(promotionalCodeItem)!
      );
      const promotionalCodesToAdd = promotionalCodes.filter(promotionalCodeItem => {
        const promotionalCodeIdentifier = getPromotionalCodeIdentifier(promotionalCodeItem);
        if (promotionalCodeIdentifier == null || promotionalCodeCollectionIdentifiers.includes(promotionalCodeIdentifier)) {
          return false;
        }
        promotionalCodeCollectionIdentifiers.push(promotionalCodeIdentifier);
        return true;
      });
      return [...promotionalCodesToAdd, ...promotionalCodeCollection];
    }
    return promotionalCodeCollection;
  }

  protected convertDateFromClient(promotionalCode: IPromotionalCode): IPromotionalCode {
    return Object.assign({}, promotionalCode, {
      startDate: promotionalCode.startDate?.isValid() ? promotionalCode.startDate.toJSON() : undefined,
      endDate: promotionalCode.endDate?.isValid() ? promotionalCode.endDate.toJSON() : undefined,
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
      res.body.forEach((promotionalCode: IPromotionalCode) => {
        promotionalCode.startDate = promotionalCode.startDate ? dayjs(promotionalCode.startDate) : undefined;
        promotionalCode.endDate = promotionalCode.endDate ? dayjs(promotionalCode.endDate) : undefined;
      });
    }
    return res;
  }
}
