import { OrderModel } from '../orders.model';
import { ProductModel } from '../products.model';
import { IOrder } from './orders.interface';

/* Database operations for orders */

// Create a new order in the database
const createOrderDB = async (orderData: IOrder) => {
  try {
    const { product: productId, quantity } = orderData;

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
  } catch (error) {
    throw error;
  }
};

// Calculate total revenue from all orders
const calculateTotalRevenue = async () => {
  try {
    // MongoDB aggregation pipeline to calculate total revenue
    const revenueData = await OrderModel.aggregate([
      {
        $lookup: {
          from: 'products', // The products collection
          localField: 'product', // The field in the orders collection
          foreignField: '_id', // The field in the products collection
          as: 'productDetails', // Alias for the joined data
        },
      },
      {
        $unwind: '$productDetails', // Unwind the product details to access individual fields
      },
      {
        $addFields: {
          totalPrice: { $multiply: ['$productDetails.price', '$quantity'] }, // Multiply price by quantity
        },
      },
      {
        $group: {
          _id: null, // Group all orders together
          totalRevenue: { $sum: '$totalPrice' }, // Sum the totalPrice field to get total revenue
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the result
          totalRevenue: 1, // Only include totalRevenue in the response
        },
      },
    ]);

    // Return total revenue or 0 if no revenue data is found
    return revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
  } catch (error: any) {
    throw new Error('Error calculating revenue: ' + error.message);
  }
};

// Export the functions to be used in the controller
export const getOrdersServices = {
  createOrderDB,
  calculateTotalRevenue,
};
