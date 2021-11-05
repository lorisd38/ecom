import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.post<IProductCart>(this.resourceUrl, productCart, { observe: 'response' });
  }

  update(productCart: IProductCart): Observable<EntityResponseType> {
    return this.http.put<IProductCart>(`${this.resourceUrl}/${getProductCartIdentifier(productCart) as number}`, productCart, {
      observe: 'response',
    });
  }

  partialUpdate(productCart: IProductCart): Observable<EntityResponseType> {
    return this.http.patch<IProductCart>(`${this.resourceUrl}/${getProductCartIdentifier(productCart) as number}`, productCart, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProductCart>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProductCart[]>(this.resourceUrl, { params: options, observe: 'response' });
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
}
