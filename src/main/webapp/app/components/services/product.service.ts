import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IProduct } from '../../entities/product/product.model';

export type EntityResponseType = HttpResponse<IProduct>;
export type EntityArrayResponseType = HttpResponse<IProduct[]>;

@Injectable({ providedIn: 'root' })
export class ProductService {
  listFavorites: IProduct[] | null = null;
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/products');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProduct>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(): Observable<EntityArrayResponseType> {
    return this.http.get<IProduct[]>(this.resourceUrl, { observe: 'response' });
  }

  querySearch(req: string, sort: string | null, sortType: string | null): Observable<EntityArrayResponseType> {
    let parameters = new HttpParams().set('query', req);
    if (sort != null && sortType != null) {
      parameters = parameters.set('sortBy', sort).set('sortOrder', sortType);
    }
    return this.http.get<IProduct[]>(this.resourceUrl, { params: parameters, observe: 'response' });
  }

  queryByCategory(req: string, sort: string | null, sortType: string | null): Observable<EntityArrayResponseType> {
    let parameters = new HttpParams().set('category', req);
    if (sort != null && sortType != null) {
      parameters = parameters.set('sortBy', sort).set('sortOrder', sortType);
    }
    return this.http.get<IProduct[]>(this.resourceUrl, { params: parameters, observe: 'response' });
  }

  queryAddToFavorites(id: number): Observable<IProduct[]> {
    return this.http.post<IProduct[]>(`${this.resourceUrl}/favorite-products/${id}`, { observe: 'response' });
  }

  queryGetFavorites(): Observable<HttpResponse<IProduct[]>> {
    return this.http.get<IProduct[]>(`${this.resourceUrl}/favorite-products`, { observe: 'response' });
  }

  loadFavorites(): void {
    this.queryGetFavorites().subscribe((res: HttpResponse<IProduct[]>) => {
      this.listFavorites = res.body ?? null;
    });
  }

  addToFavorites(id: number): void {
    this.queryAddToFavorites(id).subscribe((res: IProduct[]) => {
      this.listFavorites = res;
    });
  }

  isFavorites(product: IProduct): boolean {
    const size = this.listFavorites?.filter(p => p.id === product.id).length;
    return size != null && size > 0;
  }
}
