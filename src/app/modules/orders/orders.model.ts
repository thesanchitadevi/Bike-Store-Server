import { model, Schema } from 'mongoose';
import { IOrder } from './orders.interface';

// Order schema
const OrderSchema = new Schema<IOrder>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please enter a valid email address',
      ],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: (value: number) => value > 0,
        message: 'Quantity must be greater than zero',
      },
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price must be greater than or equal to 0'],
      validate: {
        validator: (value: number) => value >= 0,
        message: 'Total price must be greater than or equal to 0',
      },
    },
  },
  {
    versionKey: false, // Don't add a version key to the document
    timestamps: true, // Add timestamps for createdAt and updatedAt
  },
);

export const OrderModel = model<IOrder>('Order', OrderSchema);
