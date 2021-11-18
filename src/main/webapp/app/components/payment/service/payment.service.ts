import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/carts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  getTotalPrice(id: number): number {
    return 3;
  }

  /*
  getTotalPrice(id: number): Observable<HttpResponse<number>> {
    //return this.http.get<number>(`${this.resourceUrl}/price/${id}`, { observe: 'response' });
    return 3;
  }
  */

  getReduction(code: string): number {
    return 0.7;
  }
}
