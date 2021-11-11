import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUserDetails, UserDetails } from '../user-details.model';
import { UserDetailsService } from '../service/user-details.service';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICart } from 'app/entities/cart/cart.model';
import { CartService } from 'app/entities/cart/service/cart.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ITag } from 'app/entities/tag/tag.model';
import { TagService } from 'app/entities/tag/service/tag.service';
import { Role } from 'app/entities/enumerations/role.model';

@Component({
  selector: 'jhi-user-details-update',
  templateUrl: './user-details-update.component.html',
})
export class UserDetailsUpdateComponent implements OnInit {
  isSaving = false;
  roleValues = Object.keys(Role);

  addressesCollection: IAddress[] = [];
  usersSharedCollection: IUser[] = [];
  cartsCollection: ICart[] = [];
  productsSharedCollection: IProduct[] = [];
  tagsSharedCollection: ITag[] = [];

  editForm = this.fb.group({
    id: [],
    role: [null, [Validators.required]],
    birthDate: [],
    phoneNumber: [],
    address: [],
    user: [],
    cart: [],
    favorites: [],
    preferences: [],
  });

  constructor(
    protected userDetailsService: UserDetailsService,
    protected addressService: AddressService,
    protected userService: UserService,
    protected cartService: CartService,
    protected productService: ProductService,
    protected tagService: TagService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userDetails }) => {
      this.updateForm(userDetails);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userDetails = this.createFromForm();
    if (userDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.userDetailsService.update(userDetails));
    } else {
      this.subscribeToSaveResponse(this.userDetailsService.create(userDetails));
    }
  }

  trackAddressById(index: number, item: IAddress): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackCartById(index: number, item: ICart): number {
    return item.id!;
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  trackTagById(index: number, item: ITag): number {
    return item.id!;
  }

  getSelectedProduct(option: IProduct, selectedVals?: IProduct[]): IProduct {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedTag(option: ITag, selectedVals?: ITag[]): ITag {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserDetails>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(userDetails: IUserDetails): void {
    this.editForm.patchValue({
      id: userDetails.id,
      role: userDetails.role,
      birthDate: userDetails.birthDate,
      phoneNumber: userDetails.phoneNumber,
      address: userDetails.address,
      user: userDetails.user,
      cart: userDetails.cart,
      favorites: userDetails.favorites,
      preferences: userDetails.preferences,
    });

    this.addressesCollection = this.addressService.addAddressToCollectionIfMissing(this.addressesCollection, userDetails.address);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, userDetails.user);
    this.cartsCollection = this.cartService.addCartToCollectionIfMissing(this.cartsCollection, userDetails.cart);
    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      ...(userDetails.favorites ?? [])
    );
    this.tagsSharedCollection = this.tagService.addTagToCollectionIfMissing(this.tagsSharedCollection, ...(userDetails.preferences ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.addressService
      .query({ filter: 'userdetails-is-null' })
      .pipe(map((res: HttpResponse<IAddress[]>) => res.body ?? []))
      .pipe(
        map((addresses: IAddress[]) => this.addressService.addAddressToCollectionIfMissing(addresses, this.editForm.get('address')!.value))
      )
      .subscribe((addresses: IAddress[]) => (this.addressesCollection = addresses));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.cartService
      .query({ filter: 'user-is-null' })
      .pipe(map((res: HttpResponse<ICart[]>) => res.body ?? []))
      .pipe(map((carts: ICart[]) => this.cartService.addCartToCollectionIfMissing(carts, this.editForm.get('cart')!.value)))
      .subscribe((carts: ICart[]) => (this.cartsCollection = carts));

    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) =>
          this.productService.addProductToCollectionIfMissing(products, ...(this.editForm.get('favorites')!.value ?? []))
        )
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));

    this.tagService
      .query()
      .pipe(map((res: HttpResponse<ITag[]>) => res.body ?? []))
      .pipe(map((tags: ITag[]) => this.tagService.addTagToCollectionIfMissing(tags, ...(this.editForm.get('preferences')!.value ?? []))))
      .subscribe((tags: ITag[]) => (this.tagsSharedCollection = tags));
  }

  protected createFromForm(): IUserDetails {
    return {
      ...new UserDetails(),
      id: this.editForm.get(['id'])!.value,
      role: this.editForm.get(['role'])!.value,
      birthDate: this.editForm.get(['birthDate'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
      address: this.editForm.get(['address'])!.value,
      user: this.editForm.get(['user'])!.value,
      cart: this.editForm.get(['cart'])!.value,
      favorites: this.editForm.get(['favorites'])!.value,
      preferences: this.editForm.get(['preferences'])!.value,
    };
  }
}
