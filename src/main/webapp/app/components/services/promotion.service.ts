import { Injectable } from '@angular/core';
import { IPromotion } from '../../entities/promotion/promotion.model';
import { IProduct } from '../../entities/product/product.model';
import { Observable, Subscriber } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from '../../core/config/application-config.service';

export type EntityArrayResponseType = HttpResponse<IPromotion[]>;

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  public promotionsObs: Observable<IPromotion[]>;

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/promotions');

  private promotions: IPromotion[] | null = null;
  private promotionsSubscriber: Subscriber<IPromotion[]> | undefined;

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.promotionsObs = new Observable<IPromotion[]>(subscriber => (this.promotionsSubscriber = subscriber));
    this.promotionsObs.subscribe();
    this.query().subscribe(res => {
      this.promotions = res.body ?? [];
      this.promotionsSubscriber?.next(this.promotions);
    });
  }

  public getPromotions(): IPromotion[] | null {
    return this.promotions;
  }

  public inPromotion(product: IProduct): boolean {
    const size = this.promotions?.filter(promo => promo.products?.filter(p => p.id === product.id).length !== 0).length ?? 0;
    return size > 0;
  }

  public getPromotion(product: IProduct): any {
    const promoList = this.promotions?.filter(promo => promo.products?.filter(p => p.id === product.id).length !== 0) ?? [];
    if (promoList.length > 0) {
      if (promoList[0].unit === 'PERCENTAGE') {
        return '-'.concat(promoList[0].value?.toString() ?? '').concat('%');
      } else if (promoList[0].unit === 'FIX') {
        return '-'.concat(promoList[0].value?.toString() ?? '').concat('€');
      }
    }
  }

  public ajouterProducts(previousValue: IProduct[], currentValue: IProduct[]): IProduct[] {
    let res: IProduct[] = previousValue;
    for (let i = 0; i < currentValue.length; i++) {
      if (!res.includes(currentValue[i])) {
        res = [...res, currentValue[i]];
      }
    }
    return res;
  }

  public getProductsPromotion(): IProduct[] {
    let res: IProduct[] = [];
    const nbProm = this.promotions?.length ?? 0;
    for (let i = 0; i < nbProm; i++) {
      this.promotions !== null ? (res = this.ajouterProducts(res, this.promotions[i]?.products ?? [])) : '';
    }
    return res;
  }

  private query(): Observable<EntityArrayResponseType> {
    return this.http.get<IPromotion[]>(`${this.resourceUrl}/active`, { observe: 'response' });
  }
}
