import { ProductModel } from '../products.model';
import { IProduct } from './products.interface';

// services are used to interact with the database
const createProductDB = async (productData: IProduct) => {
  const result = await ProductModel.create(productData);
  console.log('result', result);

  return result;
};

const getAllProductsDB = async () => {
  const result = await ProductModel.find();
  return result;
};

// const getProductDB = async (id: string) => {
//     const result = await ProductModel.findOne({ id });
// };

// const deleteProductDB = async (id: string) => {
//   const result = await ProductModel.updateOne({ id }, { isDeleted: true });
//   return result;
// };

export const getProductServices = {
  createProductDB,
  getAllProductsDB,
};
