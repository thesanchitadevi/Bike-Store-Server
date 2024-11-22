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
    // Specific handling for known errors (e.g. validation errors)
    if (error.name === 'ValidationError') {
      res.status(400).json({
        status: false,
        message: 'Validation error',
        error: error.message,
      });
    }

    // General error handling
    res.status(500).json({
      status: false,
      message: 'Error in creating Bike',
      error: error.message || 'An unknown error occurred',
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
    // Specific handling for known errors
    if (error.name === 'ValidationError') {
      res.status(400).json({
        status: false,
        message: 'Validation error',
        error: error.message,
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
      res.status(404).json({
        status: false,
        message: 'Bike not found',
      });
      return;
    }

    res.status(200).json({
      status: true,
      message: 'Bike retrieved successfully',
      data: product,
    });
  } catch (error: any) {
    // Specific error handling for known errors
    if (error.name === 'ValidationError') {
      res.status(400).json({
        status: false,
        message: 'Validation error',
        error: error.message,
      });
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
      req.body,
    );
    // Handle case where the product is not found
    if (!updatedProduct) {
      res.status(404).json({ status: false, message: 'Bike not found' });
      return;
    }
    res.status(200).json({
      status: true,
      message: 'Bike updated successfully',
      data: updatedProduct,
    });
  } catch (error: any) {
    // Specific error handling for known errors
    if (error.name === 'ValidationError') {
      res.status(400).json({
        status: false,
        message: 'Validation error',
        error: error.message,
      });
    }

    // General error handling
    res.status(500).json({
      status: false,
      message: 'Error updating the bike',
      error: error.message || 'An unknown error occurred',
    });
  }
};

// Function to delete a product from the database
const deleteProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  try {
    const deletedProduct = await getProductServices.deleteProductDB(productId);

    if (!deletedProduct) {
      res.status(404).json({
        message: 'Bike not found',
        status: false,
        data: {},
      });
      return;
    }
    res.status(200).json({
      message: 'Bike deleted successfully',
      status: true,
      data: {},
    });
  } catch (error: any) {
    // Specific error handling for known errors
    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message,
      });
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
