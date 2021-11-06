jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UserDetailsService } from '../service/user-details.service';
import { IUserDetails, UserDetails } from '../user-details.model';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ITag } from 'app/entities/tag/tag.model';
import { TagService } from 'app/entities/tag/service/tag.service';

import { UserDetailsUpdateComponent } from './user-details-update.component';

describe('UserDetails Management Update Component', () => {
  let comp: UserDetailsUpdateComponent;
  let fixture: ComponentFixture<UserDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userDetailsService: UserDetailsService;
  let addressService: AddressService;
  let userService: UserService;
  let productService: ProductService;
  let tagService: TagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserDetailsUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(UserDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userDetailsService = TestBed.inject(UserDetailsService);
    addressService = TestBed.inject(AddressService);
    userService = TestBed.inject(UserService);
    productService = TestBed.inject(ProductService);
    tagService = TestBed.inject(TagService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call address query and add missing value', () => {
      const userDetails: IUserDetails = { id: 456 };
      const address: IAddress = { id: 96472 };
      userDetails.address = address;

      const addressCollection: IAddress[] = [{ id: 45242 }];
      jest.spyOn(addressService, 'query').mockReturnValue(of(new HttpResponse({ body: addressCollection })));
      const expectedCollection: IAddress[] = [address, ...addressCollection];
      jest.spyOn(addressService, 'addAddressToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userDetails });
      comp.ngOnInit();

      expect(addressService.query).toHaveBeenCalled();
      expect(addressService.addAddressToCollectionIfMissing).toHaveBeenCalledWith(addressCollection, address);
      expect(comp.addressesCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const userDetails: IUserDetails = { id: 456 };
      const user: IUser = { id: 48561 };
      userDetails.user = user;

      const userCollection: IUser[] = [{ id: 28523 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userDetails });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Product query and add missing value', () => {
      const userDetails: IUserDetails = { id: 456 };
      const favorites: IProduct[] = [{ id: 94866 }];
      userDetails.favorites = favorites;

      const productCollection: IProduct[] = [{ id: 30099 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [...favorites];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userDetails });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Tag query and add missing value', () => {
      const userDetails: IUserDetails = { id: 456 };
      const preferences: ITag[] = [{ id: 85768 }];
      userDetails.preferences = preferences;

      const tagCollection: ITag[] = [{ id: 41696 }];
      jest.spyOn(tagService, 'query').mockReturnValue(of(new HttpResponse({ body: tagCollection })));
      const additionalTags = [...preferences];
      const expectedCollection: ITag[] = [...additionalTags, ...tagCollection];
      jest.spyOn(tagService, 'addTagToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userDetails });
      comp.ngOnInit();

      expect(tagService.query).toHaveBeenCalled();
      expect(tagService.addTagToCollectionIfMissing).toHaveBeenCalledWith(tagCollection, ...additionalTags);
      expect(comp.tagsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userDetails: IUserDetails = { id: 456 };
      const address: IAddress = { id: 42441 };
      userDetails.address = address;
      const user: IUser = { id: 76901 };
      userDetails.user = user;
      const favorites: IProduct = { id: 44010 };
      userDetails.favorites = [favorites];
      const preferences: ITag = { id: 94713 };
      userDetails.preferences = [preferences];

      activatedRoute.data = of({ userDetails });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(userDetails));
      expect(comp.addressesCollection).toContain(address);
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.productsSharedCollection).toContain(favorites);
      expect(comp.tagsSharedCollection).toContain(preferences);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserDetails>>();
      const userDetails = { id: 123 };
      jest.spyOn(userDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userDetails }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(userDetailsService.update).toHaveBeenCalledWith(userDetails);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserDetails>>();
      const userDetails = new UserDetails();
      jest.spyOn(userDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userDetails }));
      saveSubject.complete();

      // THEN
      expect(userDetailsService.create).toHaveBeenCalledWith(userDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<UserDetails>>();
      const userDetails = { id: 123 };
      jest.spyOn(userDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userDetailsService.update).toHaveBeenCalledWith(userDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAddressById', () => {
      it('Should return tracked Address primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAddressById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackProductById', () => {
      it('Should return tracked Product primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProductById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackTagById', () => {
      it('Should return tracked Tag primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTagById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedProduct', () => {
      it('Should return option if no Product is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedProduct(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Product for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedProduct(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Product is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedProduct(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });

    describe('getSelectedTag', () => {
      it('Should return option if no Tag is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedTag(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Tag for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedTag(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Tag is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedTag(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
