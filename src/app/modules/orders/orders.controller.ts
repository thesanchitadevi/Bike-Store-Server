import { OrdersServices } from './orders.services';
import catchAsync from '../../utils/catchAsync';
import { HttpStatus } from 'http-status-ts';
import sendResponse from '../../utils/sendResponse';
import { IUser } from '../user/user.interface';

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
  createOrder,
  verifyPayment,
  getAllOrders,
  getOrder,
  getOrdersByUser,
};
