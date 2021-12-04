import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IProductCart } from 'app/entities/product-cart/product-cart.model';
import { createRequestOption } from '../../../core/request/request-util';
import { getTotalCartItems, getTotalCartPrice, ICart } from '../../../entities/cart/cart.model';
import { ProductToCartService } from '../../products/service/product-to-cart.service';
import { IProduct } from '../../../entities/product/product.model';

export type EntityResponseType = HttpResponse<IProductCart>;
export type EntityArrayResponseType = HttpResponse<IProductCart[]>;

@Injectable({ providedIn: 'root' })
export class CartService {
  cart?: ICart | null;
  total = '0';
  public nbItems = 0;
  protected resourceUrlCart = this.applicationConfigService.getEndpointFor('api/cart');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected productToCartService: ProductToCartService
  ) {}

  calcTotal(): void {
    this.total = getTotalCartPrice(this.cart).toLocaleString();
    this.nbItems = getTotalCartItems(this.cart);
  }

  queryOneCart(req?: any): Observable<EntityResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICart>(this.resourceUrlCart, { params: options, observe: 'response' });
  }

  queryQuantityProduct(idProduct: number, quantity: number): Observable<EntityResponseType> {
    const parameters = new HttpParams().set('quantity', quantity);
    return this.http.patch<IProductCart>(`${this.resourceUrlCart}/product/${idProduct}`, null, { params: parameters, observe: 'response' });
  }

  queryQuantityProductCart(idProductCart: number, quantity: number): Observable<EntityResponseType> {
    const parameters = new HttpParams().set('quantity', quantity);
    return this.http.patch<IProductCart>(`${this.resourceUrlCart}/productCart/${idProductCart}`, null, {
      params: parameters,
      observe: 'response',
    });
  }

  queryDeleteProductCart(idProductCart: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrlCart}/productCart/${idProductCart}`, {
      observe: `response`,
    });
  }

  updateQuantityProduct(item: IProduct, quantity: number): void {
    quantity > 0 ? this.updateProductCartQuantity(item, quantity) : this.deleteProductCart(item);
  }

  private updateProductCartQuantity(item: IProduct, quantity: number): void {
    this.queryQuantityProduct(item.id!, quantity).subscribe(() => {
      // Reload component
      const productLine: IProductCart | undefined = this.productToCartService.cart?.lines?.find(line => line.product?.id === item.id);
      if (productLine != null) {
        productLine.quantity = quantity;
        this.calcTotal();
      }
    });
  }

  private deleteProductCart(product: IProduct): void {
    const lineProduct: IProductCart | undefined = this.productToCartService.getProductCart(product);
    if (lineProduct?.id != null) {
      this.queryDeleteProductCart(lineProduct.id).subscribe(() => {
        // Reload component
        if (this.productToCartService.cart?.lines != null) {
          const indexProductCart = this.productToCartService.cart.lines.indexOf(lineProduct);
          // Splice is a method to delete starting from <index> a given <number of elements>.
          this.productToCartService.cart.lines.splice(indexProductCart, 1);
          this.productToCartService.buildCartContentMap();
          this.calcTotal();
        }
      });
    }
  }
}
