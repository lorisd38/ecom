import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import {FavoritesRoutingModule} from "./route/favorites-routing.module";
import {FavoritesComponent} from "./display/favorites.component";
import {ProductsModule} from "../products/products.module";

@NgModule({
    imports: [SharedModule, FavoritesRoutingModule, ProductsModule],
  declarations: [FavoritesComponent],
})
export class FavoritesModule {}
