import { Route } from '@angular/router';

import { CategoriesComponent } from './display/categories.component';

export const categoriesRoute: Route = {
  path: '',
  component: CategoriesComponent,
  outlet: 'categories',
};
