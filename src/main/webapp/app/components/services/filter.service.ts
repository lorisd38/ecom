import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../core/request/request-util';
import { EntityArrayResponseType } from '../../entities/category/service/category.service';

@Injectable({ providedIn: 'root' })
export class FilterService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/categories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}
}
