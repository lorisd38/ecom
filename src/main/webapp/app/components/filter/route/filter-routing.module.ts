import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FilterComponent } from '../display/filter.component';

const FilterRoute: Routes = [
  {
    path: '',
    component: FilterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(FilterRoute)],
  exports: [RouterModule],
})
export class FilterRoutingModule {}
