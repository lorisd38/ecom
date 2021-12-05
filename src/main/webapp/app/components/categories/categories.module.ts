import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CategoriesRoutingModule } from './route/categories-routing.module';
import { CategoriesComponent } from './display/categories.component';

@NgModule({
  imports: [SharedModule, CategoriesRoutingModule],
  declarations: [CategoriesComponent],
})
export class CategoriesModule {}
