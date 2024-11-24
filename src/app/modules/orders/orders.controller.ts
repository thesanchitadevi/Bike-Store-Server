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
              min: err.properties.min, // Minimum value (if applicable)
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
