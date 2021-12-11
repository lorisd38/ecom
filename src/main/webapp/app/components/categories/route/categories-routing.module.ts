import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoriesComponent } from '../display/categories.component';

const CategoriesRoute: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    outlet: 'categories',
  },
];

@NgModule({
  imports: [RouterModule.forChild(CategoriesRoute)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}
