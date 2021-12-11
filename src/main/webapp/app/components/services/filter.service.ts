import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../core/request/request-util';
import { EntityArrayResponseType } from '../../entities/category/service/category.service';
import { ITag } from '../../entities/tag/tag.model';

@Injectable({ providedIn: 'root' })
export class FilterService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tags');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITag[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
}
