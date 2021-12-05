import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {FavoritesComponent} from "../display/favorites.component";

const favoritesRoute: Routes = [
  {
    path: '',
    component: FavoritesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(favoritesRoute)],
  exports: [RouterModule],
})
export class FavoritesRoutingModule {}
