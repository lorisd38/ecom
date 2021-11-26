jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPromotionalCode, PromotionalCode } from '../promotional-code.model';
import { PromotionalCodeService } from '../service/promotional-code.service';

import { PromotionalCodeRoutingResolveService } from './promotional-code-routing-resolve.service';

describe('PromotionalCode routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PromotionalCodeRoutingResolveService;
  let service: PromotionalCodeService;
  let resultPromotionalCode: IPromotionalCode | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(PromotionalCodeRoutingResolveService);
    service = TestBed.inject(PromotionalCodeService);
    resultPromotionalCode = undefined;
  });

  describe('resolve', () => {
    it('should return IPromotionalCode returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPromotionalCode = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPromotionalCode).toEqual({ id: 123 });
    });

    it('should return new IPromotionalCode if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPromotionalCode = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPromotionalCode).toEqual(new PromotionalCode());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PromotionalCode })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPromotionalCode = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPromotionalCode).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
