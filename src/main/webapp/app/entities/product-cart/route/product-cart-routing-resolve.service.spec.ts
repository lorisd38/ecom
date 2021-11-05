jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProductCart, ProductCart } from '../product-cart.model';
import { ProductCartService } from '../service/product-cart.service';

import { ProductCartRoutingResolveService } from './product-cart-routing-resolve.service';

describe('ProductCart routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ProductCartRoutingResolveService;
  let service: ProductCartService;
  let resultProductCart: IProductCart | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ProductCartRoutingResolveService);
    service = TestBed.inject(ProductCartService);
    resultProductCart = undefined;
  });

  describe('resolve', () => {
    it('should return IProductCart returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProductCart = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProductCart).toEqual({ id: 123 });
    });

    it('should return new IProductCart if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProductCart = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultProductCart).toEqual(new ProductCart());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ProductCart })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultProductCart = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultProductCart).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
