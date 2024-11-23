import mongoose, { model, Schema } from 'mongoose';
import { IProduct } from './products/products.interface';

// Product schema
const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ['Mountain', 'Road', 'Hybrid', 'Electric'],
      message: 'Invalid category',
      required: true,
    },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, required: true },
  },
  {
    timestamps: true, // Add timestamps for createdAt and updatedAt
  },
);

// Static method
productSchema.statics.isProductExist = async function (productId: string) {
  const existProduct = await ProductModel.findOne({ productId });
  return existProduct;
};

// Compile the schema into a model
export const ProductModel = model<IProduct>('Product', productSchema);
