import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface IUser {
  name?: string;
  password: string;
  email: string;
  needsPasswordChange?: boolean;
  passwordChangedAt?: Date;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface IUserStaticModel extends Model<IUser> {
  // check if the user is exists by custom id
  isUserExistsByEmail(email: string): Promise<IUser>;

  isEmailTaken(id: string): Promise<IUser>;

  // check if password is matched with hashed password
  isPasswordMatched(
    plainPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
