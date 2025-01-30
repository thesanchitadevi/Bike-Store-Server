import { HttpStatus } from 'http-status-ts';
import { OrderModel } from './orders.model';
import { AppError } from '../../AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { OrderSearchableFields } from './orders.constant';
import {
  calculateTotalPriceAndValidateStock,
  orderUtils,
} from './orders.utils';
import { IUser } from '../user/user.interface';
import { IOrder } from './orders.interface';
import { ProductModel } from '../products/products.model';

/* Database operations for orders */

// Create a new order in the database
const createOrderDB = async (
  user: IUser & { _id: string },
  payload: { products: { product: string; quantity: number }[] },
  client_ip: string,
) => {
  if (!payload?.products?.length)
    throw new AppError(HttpStatus.NOT_ACCEPTABLE, 'Order is not specified');

  const products = payload.products;

  const { totalPrice, productDetails } =
    await calculateTotalPriceAndValidateStock(products);

  let order = await OrderModel.create({
    user: user._id,
    products: productDetails,
    totalPrice,
    deliveryAddress: {
      fullName: user.name,
      address: user.address,
      phone: user.phone,
    },
  });

  console.log('Order:', order._id);

  // payment gateway integration can be done here
  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: 'BDT',
    customer_name: user.name,
    customer_address: user.address,
    customer_email: user.email,
    customer_city: user.city,
    customer_phone: user.phone,
    client_ip,
  };

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }

  return payment.checkout_url;
};

// Verify payment using the shurjoPay API
const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await OrderModel.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      },
    );
  }

  return verifiedPayment;
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

// Get orders by user from the database
const getOrdersByUserDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  console.log('User ID:', userId);

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

// Update order
const updateOrderDB = async (
  orderId: string,
  userId: string,
  role: string,
  payload: Partial<IOrder>,
) => {
  let query;

  if (role === 'admin') {
    // Admin can update any order
    query = { _id: orderId };
  } else {
    // User can only update their own orders
    query = { _id: orderId, user: userId };
  }

  // Define allowed fields for users and admins
  const update: Partial<IOrder> = {};

  if (role === 'admin') {
    // Admins can only update orderStatus
    if (payload.orderStatus) {
      update.orderStatus = payload.orderStatus;
    }
  }
  // Check for user updates (product quantity updates)
  if (payload.products && payload.products.length > 0) {
    let totalPrice = 0;

    for (const item of payload.products) {
      const product = await ProductModel.findById(item.product);

      if (!product) {
        throw new AppError(
          HttpStatus.NOT_FOUND,
          `Product with ID ${item.product} not found`,
        );
      }

      // Find the order to get the existing product quantity
      const order = await OrderModel.findOne(query);
      if (!order) {
        throw new AppError(
          HttpStatus.NOT_FOUND,
          'Order not found or you do not have permission to update this order',
        );
      }

      const existingProduct = order.products.find(
        (orderItem) => orderItem.product.toString() === item.product.toString(),
      );

      const existingQuantity = existingProduct ? existingProduct.quantity : 0;

      const newQuantity = item.quantity;

      // Calculate quantity difference
      const quantityDifference = newQuantity - existingQuantity;

      if (quantityDifference > 0) {
        // If quantity is increased, check stock availability
        if (product.quantity < quantityDifference) {
          throw new AppError(
            HttpStatus.BAD_REQUEST,
            `Insufficient stock for product: ${product.name}`,
          );
        }
        product.quantity -= quantityDifference;
      } else if (quantityDifference < 0) {
        // If quantity is decreased, restock the product
        product.quantity += Math.abs(quantityDifference);
      }

      // Save the updated product stock
      await product.save();

      // Recalculate total price
      totalPrice += product.price * item.quantity;
    }

    update.products = payload.products;
    update.totalPrice = totalPrice;
  }

  // Update the order directly in the database
  const updatedOrder = await OrderModel.findOneAndUpdate(
    query,
    { $set: update },
    { new: true }, // Return the updated document
  );

  if (!updatedOrder) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      'Order not found or you do not have permission to update this order',
    );
  }

  return updatedOrder;
};

// Delete order
const deleteOrderDB = async (orderId: string, userId: string) => {
  const order = await OrderModel.findOneAndDelete({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new AppError(HttpStatus.NOT_FOUND, 'Order not found');
  }

  // Restore stock for all products in the order
  for (const item of order.products) {
    const product = await ProductModel.findById(item.product);

    if (product) {
      product.quantity += item.quantity; // Restore the stock
      await product.save();
    } else {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        `Product with ID ${item.product} not found`,
      );
    }
  }

  return order;
};

// Export the functions to be used in the controller
export const OrdersServices = {
  createOrderDB,
  getAllOrdersDB,
  verifyPayment,
  getOrderDB,
  getOrdersByUserDB,
  updateOrderDB,
  deleteOrderDB,
};
