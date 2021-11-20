import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResearchComponent } from '../list/research.component';

const researchRoute: Routes = [
  {
    path: '',
    component: ResearchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(researchRoute)],
  exports: [RouterModule],
})
export class ResearchRoutingModule {}
