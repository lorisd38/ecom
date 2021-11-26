import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PromotionalCodeComponent } from './list/promotional-code.component';
import { PromotionalCodeDetailComponent } from './detail/promotional-code-detail.component';
import { PromotionalCodeUpdateComponent } from './update/promotional-code-update.component';
import { PromotionalCodeDeleteDialogComponent } from './delete/promotional-code-delete-dialog.component';
import { PromotionalCodeRoutingModule } from './route/promotional-code-routing.module';

@NgModule({
  imports: [SharedModule, PromotionalCodeRoutingModule],
  declarations: [
    PromotionalCodeComponent,
    PromotionalCodeDetailComponent,
    PromotionalCodeUpdateComponent,
    PromotionalCodeDeleteDialogComponent,
  ],
  entryComponents: [PromotionalCodeDeleteDialogComponent],
})
export class PromotionalCodeModule {}
