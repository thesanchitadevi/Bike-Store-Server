import { Model } from 'mongoose';

// Product interface
export interface IProduct {
  name: string;
  brand: string;
  model: string;
  price: number;
  category: 'Mountain' | 'Road' | 'Hybrid' | 'Electric';
  description: string;
  quantity: number;
  inStock: boolean;
  image: string;
  reduceStock(quantity: number): Promise<void>;
}

// Static Methods
export interface ProductStaticMethods extends Model<IProduct> {
  isProductExist: (productId: string) => Promise<IProduct | null>;
}
