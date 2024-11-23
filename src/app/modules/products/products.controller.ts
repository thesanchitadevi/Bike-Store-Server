import { Request, Response } from 'express';
import { getProductServices } from './products.services';
import productValidationSchema from './products.validation';
import { z } from 'zod';

/* Controller functions for the product module  */

// Function to create a new product
const createProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    // const newProduct = await getProductServices.createProductDB(product);

    // Validated the product data
    const validatedProduct = productValidationSchema.parse(product);
    const newProduct =
      await getProductServices.createProductDB(validatedProduct);

    res.status(201).json({
      message: 'Bike created successfully',
      status: true,
      data: newProduct,
    });
  } catch (error: any) {
    // If validation fails, Zod will throw an error
    if (error instanceof z.ZodError) {
      // Map the Zod error
      const validationErrors = error.errors.reduce((acc: any, err: any) => {
        acc[err.path[0]] = {
          message: err.message,
          name: 'ValidationError',
          properties: {
            message: err.message,
            type: err.code === 'too_small' ? 'min' : err.code, // Zod's validation error type, e.g., 'min' or 'invalid_type'
            min: err.minimum || undefined,
          },
          kind: err.code === 'too_small' ? 'min' : err.code, // Validation kind (e.g., 'min' for minimum value errors)
          path: err.path[0], // Path (field name like 'price')
          value: req.body[err.path[0]], // The value that was invalid
        };
        return acc;
      }, {});

      res.status(400).json({
        message: 'Validation failed',
        success: false,
        error: validationErrors, // Return the detailed error structure
        stack: process.env.NODE_ENV === 'development' ? error.stack : null, // Show stack trace
      });
    }

    // General error handling
    res.status(500).json({
      message: 'Error in creating Bike',
      success: false,
      error: error.message || 'An unknown error occurred',
      stack: process.env.NODE_ENV === 'development' ? error.stack : null,
    });
  }
};

// Function to get all products
const getAllProducts = async (req: Request, res: Response) => {
  try {
    // Get the searchTerm from the query string
    const { searchTerm } = req.query;
    // Check if the searchTerm is a string
    const searchTermString =
      typeof searchTerm === 'string' ? searchTerm : undefined;

    const allProducts =
      await getProductServices.getAllProductsDB(searchTermString);

    // Handle case where no products are found
    if (!allProducts || allProducts.length === 0) {
      res.status(404).json({
        status: false,
        message: 'No bikes found',
      });
      return;
    }

    res.status(200).json({
      status: true,
      message: 'Bikes retrieved successfully',
      data: allProducts,
    });
  } catch (error: any) {
    // Specific handling for known errors (e.g. validation errors)
    if (error.name === 'ValidationError') {
      res.status(400).json({
        message: 'Validation failed',
        success: false,
        error: {
          name: error.name,
          errors: error.errors,
        },
        stack: process.env.NODE_ENV === 'development' ? error.stack : null,
      });
    }
    // General error handling
    res.status(500).json({
      status: false,
      message: 'Error retrieving bikes',
      error: error.message || 'An unknown error occurred',
    });
  }
};

// Function to get a product by ID
const getProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    const product = await getProductServices.getProductDB(productId);
    // Handle case where the product is not found
    if (!product) {
      throw new Error('Resource not found');
    }

    res.status(200).json({
      status: true,
      message: 'Bike retrieved successfully',
      data: product,
    });
  } catch (error: any) {
    // If the error is "Resource not found"
    if (error.message === 'Resource not found') {
      res.status(404).json({
        message: 'Resource not found',
        success: false,
        error: {
          name: 'NotFoundError',
          message: 'The requested resource could not be found',
        },
        stack: process.env.NODE_ENV === 'development' ? error.stack : null,
      });
      return;
    }
    // General error handling f
    res.status(500).json({
      status: false,
      message: 'Error retrieving the bike',
      error: error.message || 'An unknown error occurred',
    });
  }
};

// Function to update product details
const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    const updatedProduct = await getProductServices.updateProductDB(
      productId,
      req,
    );
    // Handle case where the product is not found
    if (!updatedProduct) {
      throw new Error('Resource not found');
    }

    res.status(200).json({
      status: true,
      message: 'Bike updated successfully',
      data: updatedProduct,
    });
  } catch (error: any) {
    // If validation fails, Zod will throw an error
    if (error) {
      res.status(400).json({
        message: 'Validation failed',
        success: false,
        error: {
          name: 'ValidationError',
          message: error.message,
        },
        stack: process.env.NODE_ENV === 'development' ? error.stack : null,
      });
    }
    // Handle "Resource not found" error
    if (error.message === 'Resource not found') {
      res.status(404).json({
        message: 'Resource not found',
        success: false,
        error: {
          name: 'NotFoundError',
          message: 'The requested resource could not be found',
        },
        stack: process.env.NODE_ENV === 'development' ? error.stack : null,
      });
    }

    // General error handling
    res.status(500).json({
      status: false,
      message: 'An error occurred while updating the bike',
      error: error.message || 'An unknown error occurred',
      stack: process.env.NODE_ENV === 'development' ? error.stack : null,
    });
  }
};

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
    // If the error is "Resource not found"
    if (error.message === 'Resource not found') {
      res.status(404).json({
        message: 'Resource not found',
        success: false,
        error: {
          name: 'NotFoundError',
          message: 'The requested resource could not be found',
        },
        stack: process.env.NODE_ENV === 'development' ? error.stack : null,
      });
      return;
    }
    // General error handling
    res.status(500).json({
      success: false,
      message: 'Error deleting the bike',
      error: error.message || 'An unknown error occurred',
    });
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
