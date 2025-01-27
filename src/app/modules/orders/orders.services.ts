import { HttpStatus } from 'http-status-ts';
import { OrderModel } from './orders.model';
import { AppError } from '../../AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { OrderSearchableFields } from './orders.constant';

/* Database operations for orders */

// Create a new order in the database

// Get all orders from the database
const getAllOrdersDB = async (query: Record<string, unknown>) => {
  const ordersQuery = new QueryBuilder(
    OrderModel.find()
      .populate('user', 'name email')
      .populate('products.product', 'name price'),
    query,
  )
    .search(OrderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await ordersQuery.countTotal();
  const result = await ordersQuery.modelQuery;
  return {
    meta,
    result,
  };
};

// Get order by ID from the database
const getOrderDB = async (orderId: string) => {
  const order = await OrderModel.findById(orderId)
    .populate('user', 'name email')
    .populate('products.product', 'name price');

  if (!order) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Order not found');
  }

  return order;
};

// Get orders by user from the database
const getOrdersByUserDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const ordersQuery = new QueryBuilder(
    OrderModel.find({ user: userId })
      .populate('user', 'name email')
      .populate('products.product', 'name price'),
    query,
  )
    .sort()
    .paginate()
    .fields();

  const meta = await ordersQuery.countTotal();
  const result = await ordersQuery.modelQuery;

  if (!result.length) {
    throw new AppError(HttpStatus.NOT_FOUND, 'No orders found');
  }

  return {
    meta,
    result,
  };
};

// Export the functions to be used in the controller
export const OrdersServices = {
  getAllOrdersDB,
  getOrderDB,
  getOrdersByUserDB,
};
