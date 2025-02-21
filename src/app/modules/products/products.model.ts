import { model, Schema } from 'mongoose';
import { IProduct, ProductStaticMethods } from './products.interface';

// Product schema
const productSchema = new Schema<IProduct, ProductStaticMethods>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['Mountain', 'Road', 'Hybrid', 'Electric'],
    },
    description: { type: String, required: true },
    quantity: {
      type: Number,
      required: true,
    },
    image: { type: String, default: null },
    inStock: { type: Boolean, default: true },
  },
  {
    versionKey: false, // Don't add a version key to the document
    timestamps: true, // Add timestamps for createdAt and updatedAt
  },
);

// Static method to check if a product exists
productSchema.statics.isProductExist = async function (productId: string) {
  const existProduct = await ProductModel.findOne({ _id: productId });
  return existProduct;
};

// Instance method to reduce stock
productSchema.methods.reduceStock = async function (orderQuantity: number) {
  if (this.quantity < orderQuantity) {
    throw new Error('Product out of stock');
  }
  this.quantity -= orderQuantity;
  this.inStock = this.quantity > 0;
  await this.save();
};

// Compile the schema into a model
export const ProductModel = model<IProduct, ProductStaticMethods>(
  'Product',
  productSchema,
);
