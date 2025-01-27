import { ProductServices } from './products.services';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { HttpStatus } from 'http-status-ts';

/* Controller functions for the product module  */

// Function to create a new product
const createProduct = catchAsync(async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  const parsedData = {
    ...JSON.parse(req.body.data),
    image: req.file?.path,
  };
  req.body = parsedData;

  const result = await ProductServices.createProductDB(parsedData);

  sendResponse(res, {
    statusCode: HttpStatus.CREATED,
    success: true,
    message: 'Bike created successfully',
    data: result,
  });
});

// Function to get all products
const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProductsDB(req.query);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Bikes retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

// Function to get a product by ID
const getProduct = catchAsync(async (req, res) => {
  // Get Academic Faculty by id
  const { productId } = req.params;
  const product = await ProductServices.getProductDB(productId);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Bike retrieved successfully',
    data: product,
  });
});

// Function to update product details
const updateProduct = catchAsync(async (req, res) => {
  // Update product details by id
  const { productId } = req.params;
  const updatedProduct = await ProductServices.updateProductDB(
    productId,
    req.body,
  );

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Bike updated successfully',
    data: updatedProduct,
  });
});

// Function to delete a product from the database
const deleteProduct = catchAsync(async (req, res) => {
  // Delete product by id
  const { productId } = req.params;
  await ProductServices.deleteProductDB(productId);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Bike deleted successfully',
  });
});

// Export the controller functions
export const productController = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
