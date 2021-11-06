import * as dayjs from 'dayjs';
import { IProduct } from 'app/entities/product/product.model';

export interface IPromotion {
  id?: number;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  reductionPercentage?: number;
  products?: IProduct[] | null;
}

export class Promotion implements IPromotion {
  constructor(
    public id?: number,
    public startDate?: dayjs.Dayjs,
    public endDate?: dayjs.Dayjs,
    public reductionPercentage?: number,
    public products?: IProduct[] | null
  ) {}
}

export function getPromotionIdentifier(promotion: IPromotion): number | undefined {
  return promotion.id;
}
