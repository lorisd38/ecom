import { IProduct } from 'app/entities/product/product.model';

export interface IRecipe {
  id?: number;
  name?: string;
  description?: string | null;
  steps?: string | null;
  imagePath?: string | null;
  products?: IProduct[] | null;
}

export class Recipe implements IRecipe {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string | null,
    public steps?: string | null,
    public imagePath?: string | null,
    public products?: IProduct[] | null
  ) {}
}

export function getRecipeIdentifier(recipe: IRecipe): number | undefined {
  return recipe.id;
}
