import { IProduct } from './products.interface';
import { ProductModel } from './products.model';

/* Database operations for products */

// Create a new product in the database
const createProductDB = async (productData: IProduct) => {
  try {
    const newProduct = await ProductModel.create(productData);
    return newProduct;
  } catch (error) {
    throw error;
  }
};

// Get all products from the database
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

    const allProducts = await ProductModel.find(filter);
    return allProducts;
  } catch (error) {
    throw new Error('Error retrieving bikes from the database');
  }
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
export const getProductServices = {
  createProductDB,
  getAllProductsDB,
  getProductDB,
  updateProductDB,
  deleteProductDB,
};
