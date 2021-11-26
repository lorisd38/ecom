import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PromotionalCodeComponent } from '../list/promotional-code.component';
import { PromotionalCodeDetailComponent } from '../detail/promotional-code-detail.component';
import { PromotionalCodeUpdateComponent } from '../update/promotional-code-update.component';
import { PromotionalCodeRoutingResolveService } from './promotional-code-routing-resolve.service';

const promotionalCodeRoute: Routes = [
  {
    path: '',
    component: PromotionalCodeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PromotionalCodeDetailComponent,
    resolve: {
      promotionalCode: PromotionalCodeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PromotionalCodeUpdateComponent,
    resolve: {
      promotionalCode: PromotionalCodeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PromotionalCodeUpdateComponent,
    resolve: {
      promotionalCode: PromotionalCodeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(promotionalCodeRoute)],
  exports: [RouterModule],
})
export class PromotionalCodeRoutingModule {}
