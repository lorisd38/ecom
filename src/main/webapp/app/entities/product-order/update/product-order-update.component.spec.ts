jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProductOrderService } from '../service/product-order.service';
import { IProductOrder, ProductOrder } from '../product-order.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';

import { ProductOrderUpdateComponent } from './product-order-update.component';

describe('ProductOrder Management Update Component', () => {
  let comp: ProductOrderUpdateComponent;
  let fixture: ComponentFixture<ProductOrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productOrderService: ProductOrderService;
  let productService: ProductService;
  let orderService: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProductOrderUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ProductOrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductOrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productOrderService = TestBed.inject(ProductOrderService);
    productService = TestBed.inject(ProductService);
    orderService = TestBed.inject(OrderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Product query and add missing value', () => {
      const productOrder: IProductOrder = { id: 456 };
      const product: IProduct = { id: 80438 };
      productOrder.product = product;

      const productCollection: IProduct[] = [{ id: 76511 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productOrder });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Order query and add missing value', () => {
      const productOrder: IProductOrder = { id: 456 };
      const order: IOrder = { id: 80658 };
      productOrder.order = order;

      const orderCollection: IOrder[] = [{ id: 9629 }];
      jest.spyOn(orderService, 'query').mockReturnValue(of(new HttpResponse({ body: orderCollection })));
      const additionalOrders = [order];
      const expectedCollection: IOrder[] = [...additionalOrders, ...orderCollection];
      jest.spyOn(orderService, 'addOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productOrder });
      comp.ngOnInit();

      expect(orderService.query).toHaveBeenCalled();
      expect(orderService.addOrderToCollectionIfMissing).toHaveBeenCalledWith(orderCollection, ...additionalOrders);
      expect(comp.ordersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const productOrder: IProductOrder = { id: 456 };
      const product: IProduct = { id: 59499 };
      productOrder.product = product;
      const order: IOrder = { id: 18583 };
      productOrder.order = order;

      activatedRoute.data = of({ productOrder });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(productOrder));
      expect(comp.productsSharedCollection).toContain(product);
      expect(comp.ordersSharedCollection).toContain(order);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductOrder>>();
      const productOrder = { id: 123 };
      jest.spyOn(productOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productOrder }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(productOrderService.update).toHaveBeenCalledWith(productOrder);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductOrder>>();
      const productOrder = new ProductOrder();
      jest.spyOn(productOrderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productOrder }));
      saveSubject.complete();

      // THEN
      expect(productOrderService.create).toHaveBeenCalledWith(productOrder);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductOrder>>();
      const productOrder = { id: 123 };
      jest.spyOn(productOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productOrderService.update).toHaveBeenCalledWith(productOrder);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackProductById', () => {
      it('Should return tracked Product primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProductById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackOrderById', () => {
      it('Should return tracked Order primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOrderById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
