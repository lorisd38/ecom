import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProductCart, ProductCart } from '../product-cart.model';
import { ProductCartService } from '../service/product-cart.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ICart } from 'app/entities/cart/cart.model';
import { CartService } from 'app/entities/cart/service/cart.service';

@Component({
  selector: 'jhi-product-cart-update',
  templateUrl: './product-cart-update.component.html',
})
export class ProductCartUpdateComponent implements OnInit {
  isSaving = false;

  productsSharedCollection: IProduct[] = [];
  cartsSharedCollection: ICart[] = [];

  editForm = this.fb.group({
    id: [],
    quantity: [null, [Validators.required, Validators.min(1)]],
    product: [],
    cart: [],
  });

  constructor(
    protected productCartService: ProductCartService,
    protected productService: ProductService,
    protected cartService: CartService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productCart }) => {
      this.updateForm(productCart);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productCart = this.createFromForm();
    if (productCart.id !== undefined) {
      this.subscribeToSaveResponse(this.productCartService.update(productCart));
    } else {
      this.subscribeToSaveResponse(this.productCartService.create(productCart));
    }
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  trackCartById(index: number, item: ICart): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductCart>>): void {
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

  protected updateForm(productCart: IProductCart): void {
    this.editForm.patchValue({
      id: productCart.id,
      quantity: productCart.quantity,
      product: productCart.product,
      cart: productCart.cart,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(this.productsSharedCollection, productCart.product);
    this.cartsSharedCollection = this.cartService.addCartToCollectionIfMissing(this.cartsSharedCollection, productCart.cart);
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));

    this.cartService
      .query()
      .pipe(map((res: HttpResponse<ICart[]>) => res.body ?? []))
      .pipe(map((carts: ICart[]) => this.cartService.addCartToCollectionIfMissing(carts, this.editForm.get('cart')!.value)))
      .subscribe((carts: ICart[]) => (this.cartsSharedCollection = carts));
  }

  protected createFromForm(): IProductCart {
    return {
      ...new ProductCart(),
      id: this.editForm.get(['id'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      product: this.editForm.get(['product'])!.value,
      cart: this.editForm.get(['cart'])!.value,
    };
  }
}
