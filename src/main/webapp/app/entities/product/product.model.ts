import { ICategory } from 'app/entities/category/category.model';
import { ITag } from 'app/entities/tag/tag.model';
import { IRecipe } from 'app/entities/recipe/recipe.model';
import { IPromotion } from 'app/entities/promotion/promotion.model';
import { IPromotionalCode } from 'app/entities/promotional-code/promotional-code.model';
import { IUserDetails } from 'app/entities/user-details/user-details.model';
import { WeightUnit } from 'app/entities/enumerations/weight-unit.model';

export interface IProduct {
  id?: number;
  name?: string;
  description?: string | null;
  quantity?: number;
  version?: number;
  origin?: string | null;
  brand?: string | null;
  imagePath?: string | null;
  price?: number;
  weight?: number | null;
  weightUnit?: WeightUnit | null;
  category?: ICategory | null;
  relatedCtegories?: ICategory[] | null;
  tags?: ITag[] | null;
  recipes?: IRecipe[] | null;
  associatedPromotions?: IPromotion[] | null;
  associatedPromotionalCodes?: IPromotionalCode[] | null;
  favoritesOfs?: IUserDetails[] | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string | null,
    public quantity?: number,
    public version?: number,
    public origin?: string | null,
    public brand?: string | null,
    public imagePath?: string | null,
    public price?: number,
    public weight?: number | null,
    public weightUnit?: WeightUnit | null,
    public category?: ICategory | null,
    public relatedCtegories?: ICategory[] | null,
    public tags?: ITag[] | null,
    public recipes?: IRecipe[] | null,
    public associatedPromotions?: IPromotion[] | null,
    public associatedPromotionalCodes?: IPromotionalCode[] | null,
    public favoritesOfs?: IUserDetails[] | null
  ) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
