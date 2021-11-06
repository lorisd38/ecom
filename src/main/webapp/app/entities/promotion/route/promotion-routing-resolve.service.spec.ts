jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPromotion, Promotion } from '../promotion.model';
import { PromotionService } from '../service/promotion.service';

import { PromotionRoutingResolveService } from './promotion-routing-resolve.service';

describe('Promotion routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PromotionRoutingResolveService;
  let service: PromotionService;
  let resultPromotion: IPromotion | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(PromotionRoutingResolveService);
    service = TestBed.inject(PromotionService);
    resultPromotion = undefined;
  });

  describe('resolve', () => {
    it('should return IPromotion returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPromotion = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPromotion).toEqual({ id: 123 });
    });

    it('should return new IPromotion if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPromotion = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPromotion).toEqual(new Promotion());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Promotion })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPromotion = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPromotion).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
