import {Component, Input, OnInit} from '@angular/core';
import {IProduct} from "../../entities/product/product.model";
import {ProductService} from "../../entities/product/service/product.service";
import {AccountService} from "../../core/auth/account.service";
import {HttpResponse} from "@angular/common/http";
import {IProductCart} from "../../entities/product-cart/product-cart.model";
import {getTotalCartItems, ICart} from "../../entities/cart/cart.model";
import {Router} from "@angular/router";
import {ProductToCartService} from "../products/service/product-to-cart.service";
import {CartService} from "../cart/service/cart.service";

@Component({
  selector: 'jhi-product-card',
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent implements OnInit{
  @Input() product: IProduct | null = null;

  constructor(
    protected productService: ProductService,
    public accountService: AccountService,
    private router: Router,
    protected productToCartService: ProductToCartService,
    public cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(res => {
      if (res != null) {
        this.loadCart();
      }
    });
  }

  loadCart(): void {
    this.cartService.queryOneCart().subscribe((res: HttpResponse<ICart>) => {
      this.productToCartService.cart = res.body ?? null;
      this.buildCartContentMap();
      this.cartService.nbItems = getTotalCartItems(this.productToCartService.cart);
    });
  }

  isFavoris(product: IProduct):boolean{
    const l = this.productService.listFavorites?.filter(p => p.id === product.id);
    if (l === undefined){
      return false;
    }else{
      return l.length > 0;
    }
  }

  addToFavorite(product: IProduct): void {
    if(this.accountService.isAuthenticated() && product.id !== undefined) {
      this.productService.editFavorites(product.id).subscribe((res: IProduct[]) => {
        this.productService.listFavorites = res;
      });
    }
  }

  getIntegerOfPrice(price?: number): string {
    const b = price!.toString().split('.');
    return b[0];
  }

  getDecimalsOfPrice(price?: number): string {
    const b = price!.toString().split('.');
    if (b[1].length <= 1) {
      return b[1] + '0';
    }
    return b[1];
  }

  isPresent(productId?: number): boolean {
    return this.productToCartService.productsMap.has(<number>productId);
  }

  addToCart(product: IProduct): void {
    // If no connected redirection to login page.
    if(!this.accountService.isAuthenticated()){
      this.router.navigate(['/login']);
      return;
    }
    // If the cart is not defined, it shouldn't even be possible to add a product to it
    if (this.productToCartService.cart == null) {
      console.log("HELOO")
      return;
    }
    this.productToCartService.create(product.id!).subscribe((res: HttpResponse<IProductCart>) => {
      // Update the cart
      const productCartToUpdate: IProductCart | null = res.body ?? null;
      if (productCartToUpdate != null) {
        this.productToCartService.cart!.lines?.push(productCartToUpdate);
        this.cartService.nbItems = getTotalCartItems(this.productToCartService.cart);
      }
      this.buildCartContentMap();
    });
  }

  buildCartContentMap(): void {
    this.productToCartService.productsMap.clear();
    if (this.productToCartService.cart?.lines != null) {
      this.productToCartService.cart.lines.forEach(lineProduct => this.productToCartService.productsMap.set(lineProduct.product!.id!, lineProduct));
    }
  }

  quantityProduct(item: IProduct): number {
    const lineProduct = this.getProductCart(item);
    return lineProduct?.quantity ?? 0;
  }

  updateQuantityProduct(item: IProduct, quantity: number): void {
    if (item.id != null) {
      if (quantity > 0) {
        this.cartService.queryQuantityProduct(item.id, quantity).subscribe(() => {
          // Reload component
          const productLine: IProductCart | undefined = this.productToCartService.cart?.lines?.find(line => line.product?.id === item.id);
          if (productLine != null) {
            productLine.quantity = quantity;
            this.cartService.nbItems = getTotalCartItems(this.productToCartService.cart);
          }
        });
      } else if (quantity === 0) {
        this.deleteProduct(item);
      }
    }
  }

  deleteProduct(product: IProduct): void {
    const lineProduct: IProductCart | undefined = this.getProductCart(product);
    if (lineProduct?.id != null) {
      this.cartService.queryDeleteProductCart(lineProduct.id).subscribe(() => {
        // Reload component
        if (this.productToCartService.cart?.lines != null) {
          const indexProductCart = this.productToCartService.cart.lines.indexOf(lineProduct);
          // Splice is a method to delete starting from <index> a given <number of elements>.
          this.productToCartService.cart.lines.splice(indexProductCart, 1);
          this.buildCartContentMap();
          this.cartService.nbItems = getTotalCartItems(this.productToCartService.cart);
        }
      });
    }
  }

  getProductCart(item: IProduct): IProductCart | undefined {
    return this.productToCartService.productsMap.get(<number>item.id);
  }

  updateQuantityProductByText(item: IProduct, event: any): void {
    if (event.target.value != null && event.target.value !== '') {
      if (!isNaN(Number(event.target.value))) {
        const quantity: number = +event.target.value;
        this.updateQuantityProduct(item, quantity);
      }
    }
  }
}
