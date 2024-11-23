import { Request, Response } from 'express';
import { getOrdersServices } from './orders.services';

/* Controller functions for the product module  */

export const placeOrder = async (req: Request, res: Response) => {
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

// Export the controller functions
export const orderController = {
  placeOrder,
};
