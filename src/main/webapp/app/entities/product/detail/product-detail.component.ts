import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProduct } from '../product.model';
import { WeightUnit } from '../../enumerations/weight-unit.model';
import { PromotionService } from '../../../components/services/promotion.service';
import { getPriceWeightStr } from '../../../components/products/products.module';

@Component({
  selector: 'jhi-product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  product: IProduct | null = null;

  constructor(protected activatedRoute: ActivatedRoute, public promotionService: PromotionService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.product = product;
    });
  }

  previousState(): void {
    window.history.back();
  }

  getStringWeight(product?: IProduct): string {
    if (product!.weightUnit === WeightUnit.ML || product!.weightUnit === WeightUnit.L) {
      return 'L';
    } else if (product!.weightUnit === WeightUnit.G || product!.weightUnit === WeightUnit.KG) {
      return 'kg';
    } else {
      return 'u';
    }
  }

  getPriceWeightStr(price: number, weight: number, weightUnit: WeightUnit): string {
    let b = 0;
    b = price / weight;
    if (weightUnit === WeightUnit.ML || weightUnit === WeightUnit.G) {
      b = b * 1000;
    }
    return b.toFixed(2).toString().replace('.', ',');
  }

  unitOfPrice(weightUnit: WeightUnit): string {
    switch (weightUnit) {
      case WeightUnit.KG:
        return 'au kilo';
      case WeightUnit.G:
        return 'au kilo';
      case WeightUnit.L:
        return 'au litre';
      case WeightUnit.ML:
        return 'au litre';
      default:
        return "à l'unité";
    }
  }

  getPriceWeightStrCardPromo(product: IProduct, promo: any): string {
    const res = Number(getPriceWeightStr(product.price!, product.weight!, product.weightUnit!).replace(',', '.'));
    const subPromo = Number(promo.substr(1, promo.length - 2));
    if (promo.substr(promo.length - 1) === '%') {
      return (res - (res * subPromo) / 100).toFixed(2).toString().replace('.', ',');
    } else {
      return (res - subPromo).toFixed(2).toString().replace('.', ',');
    }
  }

  getPricePromo(promo: any, price?: number): any {
    let res: any = '';
    const subPromo = Number(promo.substr(1, promo.length - 2));

    if (promo.substr(promo.length - 1) === '%') {
      res = price! - (price! * subPromo) / 100;
    } else {
      res = price! - subPromo;
    }

    return res.toFixed(2).toString().replace('.', ',');
  }
}
