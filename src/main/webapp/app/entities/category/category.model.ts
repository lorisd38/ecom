export interface ICategory {
  id?: number;
  name?: string;
  parent?: ICategory | null;
}

export class Category implements ICategory {
  constructor(public id?: number, public name?: string, public parent?: ICategory | null) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
