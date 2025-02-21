import { Types } from 'mongoose';

// User registration interface
export interface IUserRegister {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  address: string;
  city: string;
  phone: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}
