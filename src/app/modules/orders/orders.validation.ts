import { z } from 'zod';

// Define the schema for creating an order
const createOrderValidationSchema = z.object({
  body: z.object({
    products: z.array(
      z.object({
        product: z.string({
          required_error: 'Product ID is required',
          invalid_type_error: 'Product ID must be a string',
        }),
        quantity: z
          .number({
            required_error: 'Quantity is required',
            invalid_type_error: 'Quantity must be a number',
          })
          .min(1, 'Quantity must be at least 1'),
      }),
    ),
  }),
});

// Define the schema for updating an order (all fields are optional)
const updateOrderSchema = z.object({
  body: z.object({
    products: z
      .array(
        z.object({
          product: z.string({
            required_error: 'Product ID is required',
            invalid_type_error: 'Product ID must be a string',
          }),
          quantity: z
            .number({
              required_error: 'Quantity is required',
              invalid_type_error: 'Quantity must be a number',
            })
            .min(1, 'Quantity must be at least 1'),
        }),
      )
      .optional(),

    orderStatus: z
      .enum(['Pending', 'Processing', 'Shipped', 'Delivered'])
      .optional(),
  }),
});

// Export the schemas
export const OrderValidationSchema = {
  createOrderValidationSchema,
  updateOrderSchema,
};
