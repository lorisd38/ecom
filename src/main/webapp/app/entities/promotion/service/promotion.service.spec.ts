import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ReductionType } from 'app/entities/enumerations/reduction-type.model';
import { IPromotion, Promotion } from '../promotion.model';

import { PromotionService } from './promotion.service';

describe('Promotion Service', () => {
  let service: PromotionService;
  let httpMock: HttpTestingController;
  let elemDefault: IPromotion;
  let expectedResult: IPromotion | IPromotion[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PromotionService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      startDate: currentDate,
      endDate: currentDate,
      value: 0,
      unit: ReductionType.FIX,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          startDate: currentDate.format(DATE_TIME_FORMAT),
          endDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Promotion', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          startDate: currentDate.format(DATE_TIME_FORMAT),
          endDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Promotion()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Promotion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          startDate: currentDate.format(DATE_TIME_FORMAT),
          endDate: currentDate.format(DATE_TIME_FORMAT),
          value: 1,
          unit: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Promotion', () => {
      const patchObject = Object.assign(
        {
          value: 1,
        },
        new Promotion()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Promotion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          startDate: currentDate.format(DATE_TIME_FORMAT),
          endDate: currentDate.format(DATE_TIME_FORMAT),
          value: 1,
          unit: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Promotion', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPromotionToCollectionIfMissing', () => {
      it('should add a Promotion to an empty array', () => {
        const promotion: IPromotion = { id: 123 };
        expectedResult = service.addPromotionToCollectionIfMissing([], promotion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(promotion);
      });

      it('should not add a Promotion to an array that contains it', () => {
        const promotion: IPromotion = { id: 123 };
        const promotionCollection: IPromotion[] = [
          {
            ...promotion,
          },
          { id: 456 },
        ];
        expectedResult = service.addPromotionToCollectionIfMissing(promotionCollection, promotion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Promotion to an array that doesn't contain it", () => {
        const promotion: IPromotion = { id: 123 };
        const promotionCollection: IPromotion[] = [{ id: 456 }];
        expectedResult = service.addPromotionToCollectionIfMissing(promotionCollection, promotion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(promotion);
      });

      it('should add only unique Promotion to an array', () => {
        const promotionArray: IPromotion[] = [{ id: 123 }, { id: 456 }, { id: 26988 }];
        const promotionCollection: IPromotion[] = [{ id: 123 }];
        expectedResult = service.addPromotionToCollectionIfMissing(promotionCollection, ...promotionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const promotion: IPromotion = { id: 123 };
        const promotion2: IPromotion = { id: 456 };
        expectedResult = service.addPromotionToCollectionIfMissing([], promotion, promotion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(promotion);
        expect(expectedResult).toContain(promotion2);
      });

      it('should accept null and undefined values', () => {
        const promotion: IPromotion = { id: 123 };
        expectedResult = service.addPromotionToCollectionIfMissing([], null, promotion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(promotion);
      });

      it('should return initial array if no Promotion is added', () => {
        const promotionCollection: IPromotion[] = [{ id: 123 }];
        expectedResult = service.addPromotionToCollectionIfMissing(promotionCollection, undefined, null);
        expect(expectedResult).toEqual(promotionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
