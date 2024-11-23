import mongoose from 'mongoose';

// Order interface
export interface IOrder {
  email: string;
  product: mongoose.Types.ObjectId; // Reference to the Product model
  quantity: number;
  totalPrice: number;
}
