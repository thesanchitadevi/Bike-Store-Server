import { HttpStatus } from 'http-status-ts';
import { AppError } from '../../errors/AppError';
import { ProductModel } from '../products/products.model';

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
