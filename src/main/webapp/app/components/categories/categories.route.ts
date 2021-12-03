import { Route } from '@angular/router';

import { CategoriesComponent } from './list/categories.component';

export const categoriesRoute: Route = {
  path: '',
  component: CategoriesComponent,
  outlet: 'categories',
};
