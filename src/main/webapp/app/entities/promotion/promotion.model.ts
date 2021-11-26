import * as dayjs from 'dayjs';
import { IProduct } from 'app/entities/product/product.model';
import { ReductionType } from 'app/entities/enumerations/reduction-type.model';

export interface IPromotion {
  id?: number;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  value?: number;
  unit?: ReductionType;
  products?: IProduct[] | null;
}

export class Promotion implements IPromotion {
  constructor(
    public id?: number,
    public startDate?: dayjs.Dayjs,
    public endDate?: dayjs.Dayjs,
    public value?: number,
    public unit?: ReductionType,
    public products?: IProduct[] | null
  ) {}
}

export function getPromotionIdentifier(promotion: IPromotion): number | undefined {
  return promotion.id;
}
