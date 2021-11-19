import { IProduct } from 'app/entities/product/product.model';

export interface ICategory {
  id?: number;
  name?: string;
  parent?: ICategory | null;
  children?: ICategory[] | null;
  associatedProducts?: IProduct[] | null;
}

export class Category implements ICategory {
  constructor(
    public id?: number,
    public name?: string,
    public parent?: ICategory | null,
    public children?: ICategory[] | null,
    public associatedProducts?: IProduct[] | null
  ) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
