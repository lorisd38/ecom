export interface IPage<T> {
  totalPages?: number;
  totalElements?: number;
  size?: number;
  numberOfElements?: number;
  number?: number;
  content?: T[];
}

export class Page<T> implements IPage<T> {
  constructor(
    public totalPages?: number,
    public totalElements?: number,
    public size?: number,
    public numberOfElements?: number,
    public number?: number,
    public content?: T[]
  ) {}
}
