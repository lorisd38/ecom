export interface IAddress {
  id?: number;
  road?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;
  additionalDetails?: string | null;
}

export class Address implements IAddress {
  constructor(
    public id?: number,
    public road?: string | null,
    public postalCode?: string | null,
    public city?: string | null,
    public country?: string | null,
    public additionalDetails?: string | null
  ) {}
}

export function getAddressIdentifier(address: IAddress): number | undefined {
  return address.id;
}
