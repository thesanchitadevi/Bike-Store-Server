// Order model schema
import mongoose, { model, Schema } from 'mongoose';
import { IOrder } from './orders/orders.interface';

const OrderSchema = new Schema<IOrder>(
  {
    email: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the Product model
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const OrderModel = model<IOrder>('Order', OrderSchema);
