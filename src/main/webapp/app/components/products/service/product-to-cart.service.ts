import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IProductCart } from 'app/entities/product-cart/product-cart.model';

export type EntityResponseType = HttpResponse<IProductCart>;
export type EntityArrayResponseType = HttpResponse<IProductCart[]>;

@Injectable({ providedIn: 'root' })
export class ProductToCartService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/carts/product');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(productCart: IProductCart): Observable<EntityResponseType> {
    return this.http.post<IProductCart>(this.resourceUrl, productCart, { observe: 'response' });
  }
}
