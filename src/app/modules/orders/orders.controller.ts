import { Request, Response } from 'express';
import { getOrdersServices } from './orders.services';

/* Controller functions for the product module  */

// Function to place an order
const placeOrder = async (req: Request, res: Response) => {
  try {
    const order = req.body;
    const newOrder = await getOrdersServices.createOrderDB(order);

    res.status(201).json({
      message: 'Order created successfully',
      status: true,
      data: newOrder,
    });
  } catch (error: any) {
    // Handle errors here and send appropriate responses
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
    } else if (error.message === 'Insufficient stock') {
      res.status(400).json({
        message: 'Insufficient stock for this product',
        status: false,
        error: {
          name: 'BadRequestError',
          message: 'Insufficient stock for this product',
        },
      });
    }
  }
};

// Function to get the total revenue
const getRevenue = async (req: Request, res: Response) => {
  try {
    const totalRevenue = await getOrdersServices.calculateTotalRevenue();

    res.status(200).json({
      message: 'Revenue calculated successfully',
      status: true,
      data: {
        totalRevenue,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error calculating revenue',
      success: false,
      error: error.message || 'An unknown error occurred',
      stack: process.env.NODE_ENV === 'development' ? error.stack : null,
    });
  }
};

// Export the controller functions
export const orderController = {
  placeOrder,
  getRevenue,
};
