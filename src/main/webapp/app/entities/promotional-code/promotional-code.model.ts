import * as dayjs from 'dayjs';
import { IProduct } from 'app/entities/product/product.model';
import { ReductionType } from 'app/entities/enumerations/reduction-type.model';

export interface IPromotionalCode {
  id?: number;
  code?: string;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  value?: number;
  unit?: ReductionType;
  products?: IProduct[] | null;
}

export class PromotionalCode implements IPromotionalCode {
  constructor(
    public id?: number,
    public code?: string,
    public startDate?: dayjs.Dayjs,
    public endDate?: dayjs.Dayjs,
    public value?: number,
    public unit?: ReductionType,
    public products?: IProduct[] | null
  ) {}
}

export function getPromotionalCodeIdentifier(promotionalCode: IPromotionalCode): number | undefined {
  return promotionalCode.id;
}
