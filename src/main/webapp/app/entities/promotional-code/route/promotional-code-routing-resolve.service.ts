import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPromotionalCode, PromotionalCode } from '../promotional-code.model';
import { PromotionalCodeService } from '../service/promotional-code.service';

@Injectable({ providedIn: 'root' })
export class PromotionalCodeRoutingResolveService implements Resolve<IPromotionalCode> {
  constructor(protected service: PromotionalCodeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPromotionalCode> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((promotionalCode: HttpResponse<PromotionalCode>) => {
          if (promotionalCode.body) {
            return of(promotionalCode.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PromotionalCode());
  }
}
