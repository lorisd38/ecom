import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserDetails, getUserDetailsIdentifier } from '../user-details.model';

export type EntityResponseType = HttpResponse<IUserDetails>;
export type EntityArrayResponseType = HttpResponse<IUserDetails[]>;

@Injectable({ providedIn: 'root' })
export class UserDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userDetails: IUserDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userDetails);
    return this.http
      .post<IUserDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(userDetails: IUserDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userDetails);
    return this.http
      .put<IUserDetails>(`${this.resourceUrl}/${getUserDetailsIdentifier(userDetails) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(userDetails: IUserDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userDetails);
    return this.http
      .patch<IUserDetails>(`${this.resourceUrl}/${getUserDetailsIdentifier(userDetails) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IUserDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IUserDetails[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserDetailsToCollectionIfMissing(
    userDetailsCollection: IUserDetails[],
    ...userDetailsToCheck: (IUserDetails | null | undefined)[]
  ): IUserDetails[] {
    const userDetails: IUserDetails[] = userDetailsToCheck.filter(isPresent);
    if (userDetails.length > 0) {
      const userDetailsCollectionIdentifiers = userDetailsCollection.map(userDetailsItem => getUserDetailsIdentifier(userDetailsItem)!);
      const userDetailsToAdd = userDetails.filter(userDetailsItem => {
        const userDetailsIdentifier = getUserDetailsIdentifier(userDetailsItem);
        if (userDetailsIdentifier == null || userDetailsCollectionIdentifiers.includes(userDetailsIdentifier)) {
          return false;
        }
        userDetailsCollectionIdentifiers.push(userDetailsIdentifier);
        return true;
      });
      return [...userDetailsToAdd, ...userDetailsCollection];
    }
    return userDetailsCollection;
  }

  protected convertDateFromClient(userDetails: IUserDetails): IUserDetails {
    return Object.assign({}, userDetails, {
      birthDate: userDetails.birthDate?.isValid() ? userDetails.birthDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.birthDate = res.body.birthDate ? dayjs(res.body.birthDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((userDetails: IUserDetails) => {
        userDetails.birthDate = userDetails.birthDate ? dayjs(userDetails.birthDate) : undefined;
      });
    }
    return res;
  }
}
