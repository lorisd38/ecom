import { ICategory } from 'app/entities/category/category.model';
import { ITag } from 'app/entities/tag/tag.model';
import { IRecipe } from 'app/entities/recipe/recipe.model';
import { IPromotion } from 'app/entities/promotion/promotion.model';
import { IUserDetails } from 'app/entities/user-details/user-details.model';

export interface IProduct {
  id?: number;
  name?: string;
  description?: string | null;
  origin?: string | null;
  brand?: string | null;
  imagePath?: string | null;
  price?: number;
  weight?: number | null;
  category?: ICategory | null;
  tags?: ITag[] | null;
  recipes?: IRecipe[] | null;
  promotions?: IPromotion[] | null;
  favoritesOfs?: IUserDetails[] | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string | null,
    public origin?: string | null,
    public brand?: string | null,
    public imagePath?: string | null,
    public price?: number,
    public weight?: number | null,
    public category?: ICategory | null,
    public tags?: ITag[] | null,
    public recipes?: IRecipe[] | null,
    public promotions?: IPromotion[] | null,
    public favoritesOfs?: IUserDetails[] | null
  ) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
