import { Route } from '@angular/router';

import { FilterComponent } from './display/filter.component';

export const filterRoute: Route = {
  path: '',
  component: FilterComponent,
  outlet: 'filter',
};
