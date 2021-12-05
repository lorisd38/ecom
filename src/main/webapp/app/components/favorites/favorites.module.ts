import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import {FavoritesRoutingModule} from "./route/favorites-routing.module";
import {FavoritesComponent} from "./display/favorites.component";

@NgModule({
  imports: [SharedModule, FavoritesRoutingModule],
  declarations: [FavoritesComponent],
})
export class FavoritesModule {}
