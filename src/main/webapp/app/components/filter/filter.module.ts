import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FilterComponent } from './display/filter.component';
import { FilterRoutingModule } from './route/filter-routing.module';

@NgModule({
  imports: [SharedModule, FilterRoutingModule],
  declarations: [FilterComponent],
  exports: [FilterComponent],
})
export class FilterModule {}
