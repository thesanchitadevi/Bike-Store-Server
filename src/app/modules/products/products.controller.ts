import { Request, Response } from 'express';
import { ProductServices } from './products.services';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { HttpStatus } from 'http-status-ts';

/* Controller functions for the product module  */

// Function to create a new product
const createProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.createProductDB(req.body);

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
  // Update Academic Department by id
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
const deleteProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  try {
    const deletedProduct = await getProductServices.deleteProductDB(productId);

    // Handle case where the product is not found
    if (!deletedProduct) {
      throw new Error('Resource not found');
    }

    res.status(200).json({
      message: 'Bike deleted successfully',
      status: true,
      data: {},
    });
  } catch (error: any) {
    // Handle "Resource not found" error
    if (error.message === 'Resource not found') {
      const resourceNotFoundError = {
        resource: error.resource || 'Unknown Resource',
        message: error.message || 'Resource not found',
        name: error.name,
      };
      res.status(404).json({
        message: 'Resource not found',
        success: false,
        error: {
          name: resourceNotFoundError.name,
          details: resourceNotFoundError,
        },
        stack: process.env.NODE_ENV === 'development' ? error.stack : null,
      });
    } else {
      // General error handling
      res.status(500).json({
        success: false,
        message: 'Error deleting the bike',
        error: error.message || 'An unknown error occurred',
      });
    }
  }
};

// Export the controller functions
export const productController = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
