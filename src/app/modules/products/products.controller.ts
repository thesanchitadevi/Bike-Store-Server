import { Request, Response } from 'express';
import { getProductServices } from './products.services';

/* Controller functions for the product module  */

// Function to create a new product
const createProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    const newProduct = await getProductServices.createProductDB(product);

    res.status(201).json({
      message: 'Bike created successfully',
      status: true,
      data: newProduct,
    });
  } catch (error: any) {
    // Check if the error is a Mongoose validation error
    if (error.name === 'ValidationError') {
      // Map Mongoose validation error to the required structure
      const validationErrors = Object.keys(error.errors).reduce(
        (acc: any, key: string) => {
          const err = error.errors[key];
          acc[key] = {
            message: err.message,
            name: err.name,
            properties: {
              message: err.message,
              type: err.properties.type, // Validation type (e.g., 'required', 'min')
              min: err.properties.min, // Minimum value
            },
            kind: err.kind, // Validation kind (e.g., 'required', 'min')
            path: err.path, // Path of the field (e.g., 'price')
            value: req.body[key], // The invalid value
          };
          return acc;
        },
        {},
      );

      // Respond with validation errors
      res.status(400).json({
        message: 'Validation failed',
        success: false,
        error: {
          name: error.name,
          errors: validationErrors,
        },
        stack: process.env.NODE_ENV === 'development' ? error.stack : null,
      });
    } else {
      // General error handling
      res.status(500).json({
        message: 'Error in creating product',
        success: false,
        error: error.message || 'An unknown error occurred',
        stack: process.env.NODE_ENV === 'development' ? error.stack : null,
      });
    }
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
    if (error.name === 'ValidationError') {
      // Map Mongoose validation error to the required structure
      const validationErrors = Object.keys(error.errors).reduce(
        (acc: any, key: string) => {
          const err = error.errors[key];
          acc[key] = {
            message: err.message,
            name: err.name,
            properties: {
              message: err.message,
              type: err.properties.type, // Validation type (e.g., 'required', 'min')
              min: err.properties.min, // Minimum value
            },
            kind: err.kind, // Validation kind (e.g., 'required', 'min')
            path: err.path, // Path of the field (e.g., 'price')
            value: req.body[key], // The invalid value
          };
          return acc;
        },
        {},
      );
      // Respond with validation errors
      res.status(400).json({
        message: 'Validation failed',
        success: false,
        error: {
          name: error.name,
          errors: validationErrors,
        },
        stack: process.env.NODE_ENV === 'development' ? error.stack : null,
      });
    } else {
      // General error handling
      res.status(500).json({
        status: false,
        message: 'Error retrieving bikes',
        error: error.message || 'An unknown error occurred',
      });
    }
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
        status: false,
        message: 'Error retrieving the bike',
        error: error.message || 'An unknown error occurred',
      });
    }
  }
};

// Function to update product details
const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    const updatedProduct = await getProductServices.updateProductDB(
      productId,
      req.body,
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
    // Check if the error is a Mongoose validation error
    if (error.name === 'ValidationError') {
      // Map Mongoose validation error to the required structure
      const validationErrors = Object.keys(error.errors).reduce(
        (acc: any, key: string) => {
          const err = error.errors[key];
          acc[key] = {
            message: err.message,
            name: err.name,
            properties: {
              message: err.message,
              type: err.properties.type, // Validation type (e.g., 'required', 'min')
              min: err.properties.min, // Minimum value
            },
            kind: err.kind, // Validation kind (e.g., 'required', 'min')
            path: err.path, // Path of the field (e.g., 'price')
            value: req.body[key], // The invalid value
          };
          return acc;
        },
        {},
      );
      // Respond with validation errors
      res.status(400).json({
        message: 'Validation failed',
        success: false,
        error: {
          name: error.name,
          errors: validationErrors,
        },
        stack: process.env.NODE_ENV === 'development' ? error.stack : null,
      });
    }
    // Handle "Resource not found" error
    else if (error.message === 'Resource not found') {
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
        status: false,
        message: 'An error occurred while updating the bike',
        error: error.message || 'An unknown error occurred',
        stack: process.env.NODE_ENV === 'development' ? error.stack : null,
      });
    }
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
