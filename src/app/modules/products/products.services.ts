import { ProductModel } from '../products.model';
import { IProduct } from './products.interface';

// services are used to interact with the database
const createProductDB = async (productData: IProduct) => {
  const result = await ProductModel.create(productData);
  return result;
};

const getAllProductsDB = async (searchTerm?: string) => {
  try {
    let filter = {}; // Default filter for no search term

    if (searchTerm) {
      filter = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for name
          { brand: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for brand
          { category: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for category
        ],
      };
    }

    const result = await ProductModel.find(filter);
    return result;
  } catch (error) {
    throw new Error('Error retrieving products from the database');
  }
};

const getProductDB = async (productId: string) => {
  const result = await ProductModel.findOne({ _id: productId });
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
