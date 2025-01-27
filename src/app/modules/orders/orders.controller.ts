import { OrdersServices } from './orders.services';
import catchAsync from '../../utils/catchAsync';
import { HttpStatus } from 'http-status-ts';
import sendResponse from '../../utils/sendResponse';

/* Controller functions for the product module  */

// Function to place an order

// Function to get all orders
const getAllOrders = catchAsync(async (req, res) => {
  const result = await OrdersServices.getAllOrdersDB(req.query);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

// Function to get an order by ID
const getOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await OrdersServices.getOrderDB(orderId);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

// Function to get orders by user
const getOrdersByUser = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await OrdersServices.getOrdersByUserDB(user._id, req.query);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

// Export the controller functions
export const orderController = {
  getAllOrders,
  getOrder,
  getOrdersByUser,
};
