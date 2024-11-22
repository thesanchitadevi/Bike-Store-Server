import mongoose, { model, Schema } from 'mongoose';
import { IProduct } from './products/products.interface';

// Product schema
const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
);

// Compile the schema into a model
export const ProductModel = model<IProduct>('Product', productSchema);
