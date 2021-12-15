jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OrderService } from '../service/order.service';
import { IOrder, Order } from '../order.model';
import { IPromotionalCode } from 'app/entities/promotional-code/promotional-code.model';
import { PromotionalCodeService } from 'app/entities/promotional-code/service/promotional-code.service';
import { IUserDetails } from 'app/entities/user-details/user-details.model';
import { UserDetailsService } from 'app/entities/user-details/service/user-details.service';

import { OrderUpdateComponent } from './order-update.component';

describe('Order Management Update Component', () => {
  let comp: OrderUpdateComponent;
  let fixture: ComponentFixture<OrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orderService: OrderService;
  let promotionalCodeService: PromotionalCodeService;
  let userDetailsService: UserDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OrderUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(OrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orderService = TestBed.inject(OrderService);
    promotionalCodeService = TestBed.inject(PromotionalCodeService);
    userDetailsService = TestBed.inject(UserDetailsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call PromotionalCode query and add missing value', () => {
      const order: IOrder = { id: 456 };
      const promotionalCode: IPromotionalCode = { id: 65619 };
      order.promotionalCode = promotionalCode;

      const promotionalCodeCollection: IPromotionalCode[] = [{ id: 86476 }];
      jest.spyOn(promotionalCodeService, 'query').mockReturnValue(of(new HttpResponse({ body: promotionalCodeCollection })));
      const additionalPromotionalCodes = [promotionalCode];
      const expectedCollection: IPromotionalCode[] = [...additionalPromotionalCodes, ...promotionalCodeCollection];
      jest.spyOn(promotionalCodeService, 'addPromotionalCodeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(promotionalCodeService.query).toHaveBeenCalled();
      expect(promotionalCodeService.addPromotionalCodeToCollectionIfMissing).toHaveBeenCalledWith(
        promotionalCodeCollection,
        ...additionalPromotionalCodes
      );
      expect(comp.promotionalCodesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserDetails query and add missing value', () => {
      const order: IOrder = { id: 456 };
      const user: IUserDetails = { id: 95442 };
      order.user = user;

      const userDetailsCollection: IUserDetails[] = [{ id: 55391 }];
      jest.spyOn(userDetailsService, 'query').mockReturnValue(of(new HttpResponse({ body: userDetailsCollection })));
      const additionalUserDetails = [user];
      const expectedCollection: IUserDetails[] = [...additionalUserDetails, ...userDetailsCollection];
      jest.spyOn(userDetailsService, 'addUserDetailsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(userDetailsService.query).toHaveBeenCalled();
      expect(userDetailsService.addUserDetailsToCollectionIfMissing).toHaveBeenCalledWith(userDetailsCollection, ...additionalUserDetails);
      expect(comp.userDetailsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const order: IOrder = { id: 456 };
      const promotionalCode: IPromotionalCode = { id: 52710 };
      order.promotionalCode = promotionalCode;
      const user: IUserDetails = { id: 60405 };
      order.user = user;

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(order));
      expect(comp.promotionalCodesSharedCollection).toContain(promotionalCode);
      expect(comp.userDetailsSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Order>>();
      const order = { id: 123 };
      jest.spyOn(orderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: order }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(orderService.update).toHaveBeenCalledWith(order);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Order>>();
      const order = new Order();
      jest.spyOn(orderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: order }));
      saveSubject.complete();

      // THEN
      expect(orderService.create).toHaveBeenCalledWith(order);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Order>>();
      const order = { id: 123 };
      jest.spyOn(orderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orderService.update).toHaveBeenCalledWith(order);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPromotionalCodeById', () => {
      it('Should return tracked PromotionalCode primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPromotionalCodeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUserDetailsById', () => {
      it('Should return tracked UserDetails primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserDetailsById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
