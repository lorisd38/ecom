import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IProductCart } from 'app/entities/product-cart/product-cart.model';
import { ICart } from '../../../entities/cart/cart.model';
import { IProduct } from '../../../entities/product/product.model';
import { CartService } from '../../cart/service/cart.service';

export type EntityResponseType = HttpResponse<IProductCart>;
export type EntityArrayResponseType = HttpResponse<IProductCart[]>;

@Injectable({ providedIn: 'root' })
export class ProductToCartService {
  // Attributes Cart
  public productsMap: Map<number, IProductCart> = new Map();
  cart?: ICart | null;

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cart/product');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(idProduct: number): Observable<EntityResponseType> {
    return this.http.post<IProductCart>(`${this.resourceUrl}/${idProduct}`, null, { observe: 'response' });
  }

  addToCart(product: IProduct, cartService: CartService): void {
    // If the cart is not defined, it shouldn't even be possible to add a product to it
    if (this.cart == null) {
      return;
    }
    this.create(product.id!).subscribe((res: HttpResponse<IProductCart>) => {
      // Update the cart
      const productCartToUpdate: IProductCart | null = res.body ?? null;
      if (productCartToUpdate != null) {
        this.cart!.lines?.push(productCartToUpdate);
      }
      this.buildCartContentMap();
      cartService.calcTotal();
    });
  }

  buildCartContentMap(): void {
    this.productsMap.clear();
    if (this.cart?.lines != null) {
      this.cart.lines.forEach(lineProduct => this.productsMap.set(lineProduct.product!.id!, lineProduct));
    }
  }
}
