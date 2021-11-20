import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ResearchRoutingModule } from './route/research-routing.module';
import { ResearchComponent } from './list/research.component';

@NgModule({
  imports: [SharedModule, ResearchRoutingModule],
  declarations: [ResearchComponent],
})
export class ResearchModule {}
