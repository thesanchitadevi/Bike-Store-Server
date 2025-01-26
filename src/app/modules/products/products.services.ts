import QueryBuilder from '../../builder/QueryBuilder';
import { IProduct } from './products.interface';
import { ProductModel } from './products.model';

/* Database operations for products */

// Create a new product in the database
const createProductDB = async (productData: IProduct) => {
  const newProduct = await ProductModel.create(productData);
  return newProduct;
};

// Get all products from the database
const getAllProductsDB = async (query: Record<string, unknown>) => {
  const productsQuery = new QueryBuilder(ProductModel.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await productsQuery.countTotal();
  const result = await productsQuery.modelQuery;
  return {
    meta,
    result,
  };
};

// Get a single product from the database
const getProductDB = async (productId: string) => {
  try {
    const product = await ProductModel.findOne({ _id: productId });
    return product;
  } catch (error) {
    throw error;
  }
};

// Update a product in the database
const updateProductDB = async (
  productId: string,
  updateData: any,
  options: any = {},
) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      { _id: productId }, // Find product by ID
      updateData, // Update the product with the provided data
      {
        new: true,
        runValidators: true, // Ensure validation is triggered
        ...options,
      }, // Option to return the updated document
    );
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

// Delete a product from the database
const deleteProductDB = async (productId: string) => {
  try {
    const deletedproduct = await ProductModel.findByIdAndDelete({
      _id: productId,
    });
    return deletedproduct;
  } catch (error) {
    throw error;
  }
};

// Export the functions to be used in the controller
export const ProductServices = {
  createProductDB,
  getAllProductsDB,
  getProductDB,
  updateProductDB,
  deleteProductDB,
};
