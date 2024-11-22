import { ProductModel } from '../products.model';
import { IProduct } from './products.interface';

// services are used to interact with the database
const createProductDB = async (productData: IProduct) => {
  const result = await ProductModel.create(productData);
  return result;
};

const getAllProductsDB = async () => {
  const result = await ProductModel.find();
  return result;
};

const getProductDB = async (productId: string) => {
  const result = await ProductModel.findOne({ productId });
  return result;
};

// const deleteProductDB = async (id: string) => {
//   const result = await ProductModel.updateOne({ id }, { isDeleted: true });
//   return result;
// };

export const getProductServices = {
  createProductDB,
  getAllProductsDB,
  getProductDB,
};
