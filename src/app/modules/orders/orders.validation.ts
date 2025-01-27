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
    totalPrice: z
      .number({
        required_error: 'Total price is required',
        invalid_type_error: 'Total price must be a number',
      })
      .min(0, 'Total price must be a positive value'),
  }),
  orderStatus: z
    .string()
    .optional()
    .nullable()
    .default('pending')
    .transform((value) => value ?? 'pending'),
});

// Define the schema for updating an order (all fields are optional)

// Export the schemas
export const OrderValidationSchema = {
  createOrderValidationSchema,
};
