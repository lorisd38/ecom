import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IProductCart } from 'app/entities/product-cart/product-cart.model';
import { createRequestOption } from '../../../core/request/request-util';
import { ICart } from '../../../entities/cart/cart.model';

export type EntityResponseType = HttpResponse<IProductCart>;
export type EntityArrayResponseType = HttpResponse<IProductCart[]>;

@Injectable({ providedIn: 'root' })
export class CartService {
  protected resourceUrlCart = this.applicationConfigService.getEndpointFor('api/cart');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  queryOneCart(req?: any): Observable<EntityResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICart>(this.resourceUrlCart, { params: options, observe: 'response' });
  }

  queryQuantityProductCart(idProduct: number, quantity: number): Observable<EntityResponseType> {
    const parameters = new HttpParams().set('quantity', quantity);
    return this.http.patch<IProductCart>(`${this.resourceUrlCart}/product/${idProduct}`, null, { params: parameters, observe: 'response' });
  }
}
