// Order model schema
import mongoose, { model, Schema } from 'mongoose';
import { IOrder } from './orders/orders.interface';

const OrderSchema = new Schema<IOrder>({
  email: {
    type: String,
    required: [true, 'Email is required'], // Ensure the email is required
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please enter a valid email address', // Regex for email validation
    ],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required'], // Ensure product is required
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'], // Ensure quantity is required
    min: [1, 'Quantity must be at least 1'], // Ensure quantity is at least 1
    validate: {
      validator: (value: number) => value > 0,
      message: 'Quantity must be greater than zero', // Custom validation for positive quantity
    },
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'], // Ensure totalPrice is required
    min: [0, 'Total price must be greater than or equal to 0'], // Ensure totalPrice is non-negative
    validate: {
      validator: (value: number) => value >= 0,
      message: 'Total price must be greater than or equal to 0', // Custom validation for totalPrice
    },
  },
});

export const OrderModel = model<IOrder>('Order', OrderSchema);
