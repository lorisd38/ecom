import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IProductCart } from 'app/entities/product-cart/product-cart.model';
import { getTotalCartItems, getTotalCartPrice, ICart } from '../../entities/cart/cart.model';
import { IProduct } from '../../entities/product/product.model';
import { PromotionService } from './promotion.service';

export type EntityResponseType = HttpResponse<IProductCart>;
export type EntityArrayResponseType = HttpResponse<IProductCart[]>;

@Injectable({ providedIn: 'root' })
export class CartService {
  cart?: ICart | null;
  total = 0;
  public nbItems = 0;
  public productsMap: Map<number, IProductCart> = new Map();

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cart');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    public promotionService: PromotionService
  ) {}

  calcTotal(): void {
    if (this.promotionService.getPromotions() != null) {
      this.total = getTotalCartPrice(this.cart, this.promotionService)[0];
    } else {
      this.promotionService.promotionsObs.subscribe(() => {
        this.total = getTotalCartPrice(this.cart, this.promotionService)[0];
      });
    }
    this.nbItems = getTotalCartItems(this.cart);
  }

  queryOneCart(): Observable<EntityResponseType> {
    return this.http.get<ICart>(this.resourceUrl, { observe: 'response' });
  }

  queryAddToCart(idProduct: number): Observable<EntityResponseType> {
    return this.http.post<IProductCart>(`${this.resourceUrl}/products/${idProduct}`, null, { observe: 'response' });
  }

  queryQuantityProductCart(idProductCart: number, quantity: number): Observable<EntityResponseType> {
    const parameters = new HttpParams().set('quantity', quantity);
    return this.http.patch<IProductCart>(`${this.resourceUrl}/products/${idProductCart}`, null, {
      params: parameters,
      observe: 'response',
    });
  }

  queryDeleteProductCart(idProductCart: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/products/${idProductCart}`, {
      observe: `response`,
    });
  }

  addToCart(product: IProduct): void {
    // If the cart is not defined, it shouldn't even be possible to add a product to it
    if (this.cart == null) {
      return;
    }
    this.queryAddToCart(product.id!).subscribe((res: HttpResponse<IProductCart>) => {
      // Update the cart
      const productCartToUpdate: IProductCart | null = res.body ?? null;
      if (productCartToUpdate != null) {
        this.cart!.lines?.push(productCartToUpdate);
      }
      product.quantity! -= 1;
      this.buildCartContentMap();
      this.calcTotal();
    });
  }

  updateQuantityProduct(item: IProduct, quantity: number): void {
    quantity > 0 ? this.updateProductCartQuantity(item, quantity) : this.deleteProductCart(item);
  }

  buildCartContentMap(): void {
    this.productsMap.clear();
    if (this.cart?.lines != null) {
      this.cart.lines.forEach(lineProduct => this.productsMap.set(lineProduct.product!.id!, lineProduct));
    }
  }

  getProductCart(item: IProduct): IProductCart | undefined {
    return this.productsMap.get(<number>item.id);
  }

  private updateProductCartQuantity(product: IProduct, quantity: number): void {
    const lineProduct: IProductCart | undefined = this.getProductCart(product);
    if (lineProduct?.id != null) {
      this.queryQuantityProductCart(lineProduct.id, quantity).subscribe(() => {
        // Reload component
        if (this.cart?.lines != null) {
          const indexProductCart = this.cart.lines.indexOf(lineProduct);
          const oldQuantity: number = this.cart.lines[indexProductCart].quantity!;
          this.cart.lines[indexProductCart].quantity = quantity;
          product.quantity! -= quantity - oldQuantity;
          this.calcTotal();
        }
      });
    }
  }

  private deleteProductCart(product: IProduct): void {
    const lineProduct: IProductCart | undefined = this.getProductCart(product);
    if (lineProduct?.id != null) {
      this.queryDeleteProductCart(lineProduct.id).subscribe(() => {
        // Reload component
        if (this.cart?.lines != null) {
          const indexProductCart = this.cart.lines.indexOf(lineProduct);
          // Splice is a method to delete starting from <index> a given <number of elements>.
          product.quantity! += this.cart.lines[indexProductCart].quantity!;
          this.cart.lines.splice(indexProductCart, 1);
          this.buildCartContentMap();
          this.calcTotal();
          console.log(this.cart.lines);
        }
      });
    }
  }
}
