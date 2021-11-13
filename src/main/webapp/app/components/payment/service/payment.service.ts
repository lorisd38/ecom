import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  protected resourceUrlPrice = this.applicationConfigService.getEndpointFor('api/carts/price');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  getTotalPrice(): number {
    return 3;
  }

  getReduction(code: string): number {
    return 0.7;
  }
}
