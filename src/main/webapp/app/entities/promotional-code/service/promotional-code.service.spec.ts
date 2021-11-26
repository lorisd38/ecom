import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ReductionType } from 'app/entities/enumerations/reduction-type.model';
import { IPromotionalCode, PromotionalCode } from '../promotional-code.model';

import { PromotionalCodeService } from './promotional-code.service';

describe('PromotionalCode Service', () => {
  let service: PromotionalCodeService;
  let httpMock: HttpTestingController;
  let elemDefault: IPromotionalCode;
  let expectedResult: IPromotionalCode | IPromotionalCode[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PromotionalCodeService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
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

    it('should create a PromotionalCode', () => {
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

      service.create(new PromotionalCode()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PromotionalCode', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
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

    it('should partial update a PromotionalCode', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          value: 1,
        },
        new PromotionalCode()
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

    it('should return a list of PromotionalCode', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
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

    it('should delete a PromotionalCode', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPromotionalCodeToCollectionIfMissing', () => {
      it('should add a PromotionalCode to an empty array', () => {
        const promotionalCode: IPromotionalCode = { id: 123 };
        expectedResult = service.addPromotionalCodeToCollectionIfMissing([], promotionalCode);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(promotionalCode);
      });

      it('should not add a PromotionalCode to an array that contains it', () => {
        const promotionalCode: IPromotionalCode = { id: 123 };
        const promotionalCodeCollection: IPromotionalCode[] = [
          {
            ...promotionalCode,
          },
          { id: 456 },
        ];
        expectedResult = service.addPromotionalCodeToCollectionIfMissing(promotionalCodeCollection, promotionalCode);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PromotionalCode to an array that doesn't contain it", () => {
        const promotionalCode: IPromotionalCode = { id: 123 };
        const promotionalCodeCollection: IPromotionalCode[] = [{ id: 456 }];
        expectedResult = service.addPromotionalCodeToCollectionIfMissing(promotionalCodeCollection, promotionalCode);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(promotionalCode);
      });

      it('should add only unique PromotionalCode to an array', () => {
        const promotionalCodeArray: IPromotionalCode[] = [{ id: 123 }, { id: 456 }, { id: 48915 }];
        const promotionalCodeCollection: IPromotionalCode[] = [{ id: 123 }];
        expectedResult = service.addPromotionalCodeToCollectionIfMissing(promotionalCodeCollection, ...promotionalCodeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const promotionalCode: IPromotionalCode = { id: 123 };
        const promotionalCode2: IPromotionalCode = { id: 456 };
        expectedResult = service.addPromotionalCodeToCollectionIfMissing([], promotionalCode, promotionalCode2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(promotionalCode);
        expect(expectedResult).toContain(promotionalCode2);
      });

      it('should accept null and undefined values', () => {
        const promotionalCode: IPromotionalCode = { id: 123 };
        expectedResult = service.addPromotionalCodeToCollectionIfMissing([], null, promotionalCode, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(promotionalCode);
      });

      it('should return initial array if no PromotionalCode is added', () => {
        const promotionalCodeCollection: IPromotionalCode[] = [{ id: 123 }];
        expectedResult = service.addPromotionalCodeToCollectionIfMissing(promotionalCodeCollection, undefined, null);
        expect(expectedResult).toEqual(promotionalCodeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
