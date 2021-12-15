import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductCart, getProductCartIdentifier } from '../product-cart.model';

export type EntityResponseType = HttpResponse<IProductCart>;
export type EntityArrayResponseType = HttpResponse<IProductCart[]>;

@Injectable({ providedIn: 'root' })
export class ProductCartService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/product-carts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(productCart: IProductCart): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productCart);
    return this.http
      .post<IProductCart>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productCart: IProductCart): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productCart);
    return this.http
      .put<IProductCart>(`${this.resourceUrl}/${getProductCartIdentifier(productCart) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(productCart: IProductCart): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productCart);
    return this.http
      .patch<IProductCart>(`${this.resourceUrl}/${getProductCartIdentifier(productCart) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductCart>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductCart[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProductCartToCollectionIfMissing(
    productCartCollection: IProductCart[],
    ...productCartsToCheck: (IProductCart | null | undefined)[]
  ): IProductCart[] {
    const productCarts: IProductCart[] = productCartsToCheck.filter(isPresent);
    if (productCarts.length > 0) {
      const productCartCollectionIdentifiers = productCartCollection.map(productCartItem => getProductCartIdentifier(productCartItem)!);
      const productCartsToAdd = productCarts.filter(productCartItem => {
        const productCartIdentifier = getProductCartIdentifier(productCartItem);
        if (productCartIdentifier == null || productCartCollectionIdentifiers.includes(productCartIdentifier)) {
          return false;
        }
        productCartCollectionIdentifiers.push(productCartIdentifier);
        return true;
      });
      return [...productCartsToAdd, ...productCartCollection];
    }
    return productCartCollection;
  }

  protected convertDateFromClient(productCart: IProductCart): IProductCart {
    return Object.assign({}, productCart, {
      creationDatetime: productCart.creationDatetime?.isValid() ? productCart.creationDatetime.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.creationDatetime = res.body.creationDatetime ? dayjs(res.body.creationDatetime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((productCart: IProductCart) => {
        productCart.creationDatetime = productCart.creationDatetime ? dayjs(productCart.creationDatetime) : undefined;
      });
    }
    return res;
  }
}
