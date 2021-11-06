import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProductCart, ProductCart } from '../product-cart.model';

import { ProductCartService } from './product-cart.service';

describe('ProductCart Service', () => {
  let service: ProductCartService;
  let httpMock: HttpTestingController;
  let elemDefault: IProductCart;
  let expectedResult: IProductCart | IProductCart[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductCartService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      quantity: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ProductCart', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ProductCart()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProductCart', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          quantity: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProductCart', () => {
      const patchObject = Object.assign({}, new ProductCart());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProductCart', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          quantity: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ProductCart', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProductCartToCollectionIfMissing', () => {
      it('should add a ProductCart to an empty array', () => {
        const productCart: IProductCart = { id: 123 };
        expectedResult = service.addProductCartToCollectionIfMissing([], productCart);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productCart);
      });

      it('should not add a ProductCart to an array that contains it', () => {
        const productCart: IProductCart = { id: 123 };
        const productCartCollection: IProductCart[] = [
          {
            ...productCart,
          },
          { id: 456 },
        ];
        expectedResult = service.addProductCartToCollectionIfMissing(productCartCollection, productCart);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductCart to an array that doesn't contain it", () => {
        const productCart: IProductCart = { id: 123 };
        const productCartCollection: IProductCart[] = [{ id: 456 }];
        expectedResult = service.addProductCartToCollectionIfMissing(productCartCollection, productCart);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productCart);
      });

      it('should add only unique ProductCart to an array', () => {
        const productCartArray: IProductCart[] = [{ id: 123 }, { id: 456 }, { id: 17244 }];
        const productCartCollection: IProductCart[] = [{ id: 123 }];
        expectedResult = service.addProductCartToCollectionIfMissing(productCartCollection, ...productCartArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const productCart: IProductCart = { id: 123 };
        const productCart2: IProductCart = { id: 456 };
        expectedResult = service.addProductCartToCollectionIfMissing([], productCart, productCart2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productCart);
        expect(expectedResult).toContain(productCart2);
      });

      it('should accept null and undefined values', () => {
        const productCart: IProductCart = { id: 123 };
        expectedResult = service.addProductCartToCollectionIfMissing([], null, productCart, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productCart);
      });

      it('should return initial array if no ProductCart is added', () => {
        const productCartCollection: IProductCart[] = [{ id: 123 }];
        expectedResult = service.addProductCartToCollectionIfMissing(productCartCollection, undefined, null);
        expect(expectedResult).toEqual(productCartCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
