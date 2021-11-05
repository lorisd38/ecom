import * as dayjs from 'dayjs';
import { IAddress } from 'app/entities/address/address.model';
import { IUser } from 'app/entities/user/user.model';
import { IProduct } from 'app/entities/product/product.model';
import { ITag } from 'app/entities/tag/tag.model';
import { Role } from 'app/entities/enumerations/role.model';

export interface IUserDetails {
  id?: number;
  role?: Role;
  birthDate?: dayjs.Dayjs | null;
  phoneNumber?: string | null;
  address?: IAddress | null;
  user?: IUser | null;
  favorites?: IProduct[] | null;
  preferences?: ITag[] | null;
}

export class UserDetails implements IUserDetails {
  constructor(
    public id?: number,
    public role?: Role,
    public birthDate?: dayjs.Dayjs | null,
    public phoneNumber?: string | null,
    public address?: IAddress | null,
    public user?: IUser | null,
    public favorites?: IProduct[] | null,
    public preferences?: ITag[] | null
  ) {}
}

export function getUserDetailsIdentifier(userDetails: IUserDetails): number | undefined {
  return userDetails.id;
}
