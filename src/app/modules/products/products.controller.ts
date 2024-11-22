import { Request, Response } from 'express';
import { getProductServices } from './products.services';

// Create a Controller.
const createProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    console.log('product', product);

    const result = await getProductServices.createProductDB(product);
    console.log('result', result);

    res.status(200).json({
      message: 'Bike created successfully',
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error in creating Product',
      error: error,
    });

    // Specific handling for known errors (optional)
    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message || 'Error in creating Product',
        error: error,
      });
    }
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query; // Get the searchTerm from the query string
    const searchTermString =
      typeof searchTerm === 'string' ? searchTerm : undefined;
    const result = await getProductServices.getAllProductsDB(searchTermString);

    res.status(200).json({
      success: true,
      message: 'Bikes retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error in getAllProducts',
      error: error.message,
    });
  }
};

const getProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    // console.log('Product ID:', productId);
    const result = await getProductServices.getProductDB(productId);
    res.status(200).json({
      success: true,
      message: 'Bike retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Cannot get the product',
      error: error.message,
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
    if (!updatedProduct) {
      res.status(404).json({ status: false, message: 'Product not found' });
      return;
    }
    res.status(200).json({
      status: true,
      message: 'Bike updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Server Error' });
  }
};

// const deleteProduct = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const result = await getProductServices.deleteProductDB(id);
//     res.status(200).json({
//       success: true,
//       message: 'Product deleted successfully',
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: 'Error in deleteProduct',
//       error: error.message,
//     });
//   }
// };

export const productController = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
};
