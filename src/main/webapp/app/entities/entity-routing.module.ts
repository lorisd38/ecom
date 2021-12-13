import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'address',
        data: { pageTitle: 'ecomApp.address.home.title' },
        loadChildren: () => import('./address/address.module').then(m => m.AddressModule),
      },
      {
        path: 'order',
        data: { pageTitle: 'ecomApp.order.home.title' },
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
      },
      {
        path: 'product',
        data: { pageTitle: 'ecomApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'promotion',
        data: { pageTitle: 'ecomApp.promotion.home.title' },
        loadChildren: () => import('./promotion/promotion.module').then(m => m.PromotionModule),
      },
      {
        path: 'carts',
        data: { pageTitle: 'ecomApp.cart.home.title' },
        loadChildren: () => import('./cart/cart.module').then(m => m.CartModule),
      },
      {
        path: 'product-order',
        data: { pageTitle: 'ecomApp.productOrder.home.title' },
        loadChildren: () => import('./product-order/product-order.module').then(m => m.ProductOrderModule),
      },
      {
        path: 'product-cart',
        data: { pageTitle: 'ecomApp.productCart.home.title' },
        loadChildren: () => import('./product-cart/product-cart.module').then(m => m.ProductCartModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'ecomApp.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'recipe',
        data: { pageTitle: 'ecomApp.recipe.home.title' },
        loadChildren: () => import('./recipe/recipe.module').then(m => m.RecipeModule),
      },
      {
        path: 'tag',
        data: { pageTitle: 'ecomApp.tag.home.title' },
        loadChildren: () => import('./tag/tag.module').then(m => m.TagModule),
      },
      {
        path: 'user-details',
        data: { pageTitle: 'ecomApp.userDetails.home.title' },
        loadChildren: () => import('./user-details/user-details.module').then(m => m.UserDetailsModule),
      },
      {
        path: 'promotional-code',
        data: { pageTitle: 'ecomApp.promotionalCode.home.title' },
        loadChildren: () => import('./promotional-code/promotional-code.module').then(m => m.PromotionalCodeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
