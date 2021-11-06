import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductCart, ProductCart } from '../product-cart.model';
import { ProductCartService } from '../service/product-cart.service';

@Injectable({ providedIn: 'root' })
export class ProductCartRoutingResolveService implements Resolve<IProductCart> {
  constructor(protected service: ProductCartService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductCart> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productCart: HttpResponse<ProductCart>) => {
          if (productCart.body) {
            return of(productCart.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProductCart());
  }
}
