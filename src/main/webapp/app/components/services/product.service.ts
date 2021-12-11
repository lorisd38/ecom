import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
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

  query(req: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProduct[]>(`${this.resourceUrl}`, { params: options, observe: 'response' });
  }

  querySearch(req: string, tagsId: string): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    console.log(`------> ${this.resourceUrl}?query=${req.toLowerCase()}`);

    return this.http.get<IProduct[]>(`${this.resourceUrl}?query=${req.toLowerCase()}&filter=${tagsId}`, {
      params: options,
      observe: 'response',
    });
  }

  queryByCategory(req: string, tagsId: string): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProduct[]>(`${this.resourceUrl}?category=${req}&filter=${tagsId}`, { params: options, observe: 'response' });
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
