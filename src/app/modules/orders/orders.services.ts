import { OrderModel } from '../orders.model';
import { ProductModel } from '../products.model';
import { IOrder } from './orders.interface';

/* Database operations for orders */

const createOrderDB = async (orderData: IOrder) => {
  const { product: productId, quantity } = orderData;

  // Fetch the product
  const product = await ProductModel.isProductExist(productId.toString());

  if (!product) {
    throw new Error('Resource not found');
  }

  // Reduce stock
  await product.reduceStock(quantity);

  const newOrder = await OrderModel.create(orderData);

  if (!newOrder || newOrder.quantity < orderData.quantity!) {
    throw new Error('Insufficient stock or product not found');
  }
  return newOrder;
};

export const getOrdersServices = {
  createOrderDB,
};
