import { IProduct } from 'app/entities/product/product.model';
import { IUserDetails } from 'app/entities/user-details/user-details.model';

export interface ITag {
  id?: number;
  name?: string;
  color?: string | null;
  products?: IProduct[] | null;
  preferencesOfs?: IUserDetails[] | null;
}

export class Tag implements ITag {
  constructor(
    public id?: number,
    public name?: string,
    public color?: string | null,
    public products?: IProduct[] | null,
    public preferencesOfs?: IUserDetails[] | null
  ) {}
}

export function getTagIdentifier(tag: ITag): number | undefined {
  return tag.id;
}
