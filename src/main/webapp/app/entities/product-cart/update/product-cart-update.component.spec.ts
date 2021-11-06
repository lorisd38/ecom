jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProductCartService } from '../service/product-cart.service';
import { IProductCart, ProductCart } from '../product-cart.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ICart } from 'app/entities/cart/cart.model';
import { CartService } from 'app/entities/cart/service/cart.service';

import { ProductCartUpdateComponent } from './product-cart-update.component';

describe('ProductCart Management Update Component', () => {
  let comp: ProductCartUpdateComponent;
  let fixture: ComponentFixture<ProductCartUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productCartService: ProductCartService;
  let productService: ProductService;
  let cartService: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProductCartUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ProductCartUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductCartUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productCartService = TestBed.inject(ProductCartService);
    productService = TestBed.inject(ProductService);
    cartService = TestBed.inject(CartService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Product query and add missing value', () => {
      const productCart: IProductCart = { id: 456 };
      const product: IProduct = { id: 70530 };
      productCart.product = product;

      const productCollection: IProduct[] = [{ id: 78696 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productCart });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Cart query and add missing value', () => {
      const productCart: IProductCart = { id: 456 };
      const cart: ICart = { id: 3399 };
      productCart.cart = cart;

      const cartCollection: ICart[] = [{ id: 16673 }];
      jest.spyOn(cartService, 'query').mockReturnValue(of(new HttpResponse({ body: cartCollection })));
      const additionalCarts = [cart];
      const expectedCollection: ICart[] = [...additionalCarts, ...cartCollection];
      jest.spyOn(cartService, 'addCartToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productCart });
      comp.ngOnInit();

      expect(cartService.query).toHaveBeenCalled();
      expect(cartService.addCartToCollectionIfMissing).toHaveBeenCalledWith(cartCollection, ...additionalCarts);
      expect(comp.cartsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const productCart: IProductCart = { id: 456 };
      const product: IProduct = { id: 34813 };
      productCart.product = product;
      const cart: ICart = { id: 33461 };
      productCart.cart = cart;

      activatedRoute.data = of({ productCart });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(productCart));
      expect(comp.productsSharedCollection).toContain(product);
      expect(comp.cartsSharedCollection).toContain(cart);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductCart>>();
      const productCart = { id: 123 };
      jest.spyOn(productCartService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productCart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productCart }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(productCartService.update).toHaveBeenCalledWith(productCart);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductCart>>();
      const productCart = new ProductCart();
      jest.spyOn(productCartService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productCart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productCart }));
      saveSubject.complete();

      // THEN
      expect(productCartService.create).toHaveBeenCalledWith(productCart);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProductCart>>();
      const productCart = { id: 123 };
      jest.spyOn(productCartService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productCart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productCartService.update).toHaveBeenCalledWith(productCart);
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

    describe('trackCartById', () => {
      it('Should return tracked Cart primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCartById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
