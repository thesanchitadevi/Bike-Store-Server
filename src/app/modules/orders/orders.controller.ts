import { OrdersServices } from './orders.services';
import catchAsync from '../../utils/catchAsync';
import { HttpStatus } from 'http-status-ts';
import sendResponse from '../../utils/sendResponse';
import { IUser } from '../user/user.interface';
import mongoose from 'mongoose';
import { AppError } from '../../errors/AppError';

/* Controller functions for the product module  */

// Function to place an order
const createOrder = catchAsync(async (req, res) => {
  const user = req.user as IUser;
  const payload = req.body;

  const result = await OrdersServices.createOrderDB(user, payload, req.ip!);

  sendResponse(res, {
    statusCode: HttpStatus.CREATED,
    success: true,
    message: 'Order placed successfully',
    data: result,
  });
});

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

const verifyPayment = catchAsync(async (req, res) => {
  const order = await OrdersServices.verifyPayment(
    req.query.order_id as string,
  );

  sendResponse(res, {
    statusCode: HttpStatus.CREATED,
    success: true,
    message: 'Order verified successfully',
    data: order,
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
  console.log('getOrdersByUser route hit');
  const user = req.user;
  console.log('User:', user);

  const result = await OrdersServices.getOrdersByUserDB(user._id, req.query);

  if (!mongoose.Types.ObjectId.isValid(user._id)) {
    throw new AppError(HttpStatus.BAD_REQUEST, 'Invalid user ID');
  }

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

// Function to update an order
const updateOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const user = req.user;

  const result = await OrdersServices.updateOrderDB(
    orderId,
    user._id,
    user.role,
    req.body,
  );

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Order updated successfully',
    data: result,
  });
});

// Function to delete an order
const deleteOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  // const user = req.user;

  await OrdersServices.deleteOrderDB(orderId);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Order deleted successfully',
  });
});

// Export the controller functions
export const orderController = {
  createOrder,
  verifyPayment,
  getAllOrders,
  getOrder,
  getOrdersByUser,
  updateOrder,
  deleteOrder,
};
