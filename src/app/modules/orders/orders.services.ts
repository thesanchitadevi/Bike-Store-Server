import { HttpStatus } from 'http-status-ts';
import { IUser } from '../user/user.interface';
import { OrderModel } from './orders.model';
import { AppError } from '../../AppError';
import { calculateTotalPriceAndValidateStock } from './orders.utils';
import QueryBuilder from '../../builder/QueryBuilder';
import { OrderSearchableFields } from './orders.constant';

/* Database operations for orders */

// Create a new order in the database
const createOrderDB = async (
  user: IUser,
  payload: { products: { product: string; quantity: number }[] },
  deliveryAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  },
  paymentMethod: 'COD' | 'SurjoPay',
) => {
  console.log('Received Payload:', payload);
  // Validate if products are provided
  if (!payload?.products?.length) {
    throw new AppError(
      HttpStatus.NOT_ACCEPTABLE,
      'Please provide products to create an order',
    );
  }

  // Calculate total price and validate stock
  const { totalPrice, productDetails } =
    await calculateTotalPriceAndValidateStock(payload.products);

  // Create the order
  const order = await OrderModel.create({
    user,
    products: productDetails,
    totalPrice,
    deliveryAddress,
    paymentMethod,
    paymentStatus: 'pending', // Default payment status
    status: 'pending', // Default order status
  });

  return order;
};

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

// Export the functions to be used in the controller
export const OrdersServices = {
  createOrderDB,
  getAllOrdersDB,
  getOrderDB,
};
