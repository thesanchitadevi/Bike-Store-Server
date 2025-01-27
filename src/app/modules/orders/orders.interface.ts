import { Types } from 'mongoose';

// Order interface
export interface IOrder {
  user: Types.ObjectId;
  products: {
    product: Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  status: 'Pending' | 'Paid' | 'Failed' | 'Cancelled';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
}
