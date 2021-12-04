import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IProductCart } from 'app/entities/product-cart/product-cart.model';
import { createRequestOption } from '../../../core/request/request-util';
import {getTotalCartItems, getTotalCartPrice, ICart} from '../../../entities/cart/cart.model';

export type EntityResponseType = HttpResponse<IProductCart>;
export type EntityArrayResponseType = HttpResponse<IProductCart[]>;

@Injectable({ providedIn: 'root' })
export class CartService {
  cart?: ICart | null;
  total = '0';
  public nbItems = 0;
  protected resourceUrlCart = this.applicationConfigService.getEndpointFor('api/cart');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  calcTotal(): void {
    this.total = g(this.cart).toLocaleString();
    this.nbItems = getTotalCartItems(this.cart);
  }

  queryOneCart(req?: any): Observable<EntityResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICart>(this.resourceUrlCart, { params: options, observe: 'response' });
  }

  queryQuantityProduct(idProduct: number, quantity: number): Observable<EntityResponseType> {
    const parameters = new HttpParams().set('quantity', quantity);
    return this.http.patch<IProductCart>(`${this.resourceUrlCart}/product/${idProduct}`, null, { params: parameters, observe: 'response' });
  }

  queryQuantityProductCart(idProductCart: number, quantity: number): Observable<EntityResponseType> {
    const parameters = new HttpParams().set('quantity', quantity);
    return this.http.patch<IProductCart>(`${this.resourceUrlCart}/productCart/${idProductCart}`, null, {
      params: parameters,
      observe: 'response',
    });
  }

  queryDeleteProductCart(idProductCart: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrlCart}/productCart/${idProductCart}`, {
      observe: `response`,
    });
  }
}
