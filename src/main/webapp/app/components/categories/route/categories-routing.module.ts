import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoriesComponent } from '../list/categories.component';

const paymentRoute: Routes = [
  {
    path: '',
    component: CategoriesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(paymentRoute)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}
