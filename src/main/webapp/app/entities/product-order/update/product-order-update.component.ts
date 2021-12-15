import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProductOrder, ProductOrder } from '../product-order.model';
import { ProductOrderService } from '../service/product-order.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { ReductionType } from 'app/entities/enumerations/reduction-type.model';

@Component({
  selector: 'jhi-product-order-update',
  templateUrl: './product-order-update.component.html',
})
export class ProductOrderUpdateComponent implements OnInit {
  isSaving = false;
  reductionTypeValues = Object.keys(ReductionType);

  productsSharedCollection: IProduct[] = [];
  ordersSharedCollection: IOrder[] = [];

  editForm = this.fb.group({
    id: [],
    quantity: [null, [Validators.required, Validators.min(1)]],
    price: [null, [Validators.required]],
    promotionValue: [],
    promotionType: [],
    promoCodeValue: [],
    promoCodeType: [],
    product: [],
    order: [],
  });

  constructor(
    protected productOrderService: ProductOrderService,
    protected productService: ProductService,
    protected orderService: OrderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productOrder }) => {
      this.updateForm(productOrder);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productOrder = this.createFromForm();
    if (productOrder.id !== undefined) {
      this.subscribeToSaveResponse(this.productOrderService.update(productOrder));
    } else {
      this.subscribeToSaveResponse(this.productOrderService.create(productOrder));
    }
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  trackOrderById(index: number, item: IOrder): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductOrder>>): void {
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

  protected updateForm(productOrder: IProductOrder): void {
    this.editForm.patchValue({
      id: productOrder.id,
      quantity: productOrder.quantity,
      price: productOrder.price,
      promotionValue: productOrder.promotionValue,
      promotionType: productOrder.promotionType,
      promoCodeValue: productOrder.promoCodeValue,
      promoCodeType: productOrder.promoCodeType,
      product: productOrder.product,
      order: productOrder.order,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      productOrder.product
    );
    this.ordersSharedCollection = this.orderService.addOrderToCollectionIfMissing(this.ordersSharedCollection, productOrder.order);
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));

    this.orderService
      .query()
      .pipe(map((res: HttpResponse<IOrder[]>) => res.body ?? []))
      .pipe(map((orders: IOrder[]) => this.orderService.addOrderToCollectionIfMissing(orders, this.editForm.get('order')!.value)))
      .subscribe((orders: IOrder[]) => (this.ordersSharedCollection = orders));
  }

  protected createFromForm(): IProductOrder {
    return {
      ...new ProductOrder(),
      id: this.editForm.get(['id'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      price: this.editForm.get(['price'])!.value,
      promotionValue: this.editForm.get(['promotionValue'])!.value,
      promotionType: this.editForm.get(['promotionType'])!.value,
      promoCodeValue: this.editForm.get(['promoCodeValue'])!.value,
      promoCodeType: this.editForm.get(['promoCodeType'])!.value,
      product: this.editForm.get(['product'])!.value,
      order: this.editForm.get(['order'])!.value,
    };
  }
}
