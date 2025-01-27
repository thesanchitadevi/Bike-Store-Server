/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatus } from 'http-status-ts';
import { AppError } from '../../errors/AppError';
import { ProductModel } from '../products/products.model';
import Shurjopay, { PaymentResponse, VerificationResponse } from 'shurjopay';
import config from '../../config';

// Function to calculate the total price and validate product availability
export const calculateTotalPriceAndValidateStock = async (
  products: { product: string; quantity: number }[],
) => {
  let totalPrice = 0;
  const productDetails = [];

  for (const item of products) {
    const product = await ProductModel.findById(item.product);

    // Check if the product exists
    if (!product) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        `Product with ID ${item.product} not found`,
      );
    }

    // Check if there is enough stock
    if (product.quantity < item.quantity) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        `Insufficient stock for product: ${product.name}`,
      );
    }

    // Calculate subtotal and update total price
    const subtotal = product.price * item.quantity;
    totalPrice += subtotal;

    // Add product details to the array
    productDetails.push({
      product: item.product,
      quantity: item.quantity,
      price: product.price, // Include the price of the product at the time of order
    });

    // Reduce stock for the product
    await product.reduceStock(item.quantity);
  }

  return { totalPrice, productDetails };
};

// SurjoPay payment gateway integration
const shurjopay = new Shurjopay();

shurjopay.config(
  config.sp_endpoint!,
  config.sp_username!,
  config.sp_password!,
  config.sp_prefix!,
  config.sp_return_url!,
);

console.log('Shurjopay configured', shurjopay);

const makePaymentAsync = async (
  paymentPayload: any,
): Promise<PaymentResponse> => {
  return new Promise((resolve, reject) => {
    shurjopay.makePayment(
      paymentPayload,
      (response) => resolve(response),
      (error) => reject(error),
    );
  });

  // const paymentResult = await shurjopay.makePayment(
  //   paymentPayload,
  //   (response) => console.log(response),
  //   (error) => console.log(error),
  // );
  // return paymentResult;
};

const verifyPaymentAsync = (
  order_id: string,
): Promise<VerificationResponse[]> => {
  return new Promise((resolve, reject) => {
    shurjopay.verifyPayment(
      order_id,
      (response) => resolve(response),
      (error) => reject(error),
    );
  });
};

export const orderUtils = {
  makePaymentAsync,
  verifyPaymentAsync,
};
