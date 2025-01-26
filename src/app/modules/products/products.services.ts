import QueryBuilder from '../../builder/QueryBuilder';
import { ProductSearchableFields } from './products.constant';
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
    .search(ProductSearchableFields)
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
  const product = await ProductModel.findById(productId);
  return product;
};

// Update a product in the database
const updateProductDB = async (
  productId: string,
  updateData: Partial<IProduct>,
) => {
  const updatedProduct = await ProductModel.findByIdAndUpdate(
    { _id: productId }, // Find product by ID
    updateData, // Update the product with the provided data
    { new: true, runValidators: true }, // Return the updated document and run validators
  );

  if (!updatedProduct) {
    throw new Error('Product not found');
  }

  return updatedProduct;
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
