import { Types } from 'mongoose';

export interface IDeliveryAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Order interface
export interface IOrder {
  user: Types.ObjectId;
  products: Array<{
    product: Types.ObjectId;
    quantity: number;
  }>;
  totalPrice: number;
  paymentMethod: 'COD' | 'SurjoPay';
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'completed' | 'cancelled';
  deliveryAddress: IDeliveryAddress;
}
