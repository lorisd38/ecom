import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../core/request/request-util';
import {Category, ICategory} from '../../entities/category/category.model';
import { EntityArrayResponseType } from '../../entities/category/service/category.service';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  public listCategory: Category[] = [];

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/categories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategory[]>(this.resourceUrl + '/parents', { params: options, observe: 'response' });
  }
}
