import { model, Schema } from 'mongoose';
import { IOrder } from './orders.interface';

// Delivery address schema
const deliveryAddressSchema = new Schema({
  fullName: { type: String, required: [true, 'Full name is required'] },
  phone: { type: String, required: [true, 'Phone number is required'] },
  addressLine1: {
    type: String,
    required: [true, 'Address line 1 is required'],
  },
  addressLine2: { type: String },
  city: { type: String, required: [true, 'City is required'] },
  state: { type: String, required: [true, 'State is required'] },
  postalCode: { type: String, required: [true, 'Postal code is required'] },
  country: { type: String, required: [true, 'Country is required'] },
});

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
    paymentMethod: {
      type: String,
      enum: ['COD', 'SurjoPay'], // Allowed payment methods
      required: [true, 'Payment method is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
    deliveryAddress: {
      type: deliveryAddressSchema,
      required: [true, 'Delivery address is required'],
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the version key (__v)
  },
);

export const OrderModel = model<IOrder>('Order', OrderSchema);
