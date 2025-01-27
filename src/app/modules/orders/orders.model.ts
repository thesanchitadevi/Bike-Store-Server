import { model, Schema } from 'mongoose';
import { IOrder } from './orders.interface';

// Order schema
const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Product ID is required'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price must be a positive value'],
    },

    orderStatus: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the version key (__v)
  },
);

export const OrderModel = model<IOrder>('Order', OrderSchema);
