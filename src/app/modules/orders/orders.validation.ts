import { z } from 'zod';

// Define the schema for delivery address
const deliveryAddressSchema = z.object({
  fullName: z
    .string({
      required_error: 'Full name is required',
      invalid_type_error: 'Full name must be a string',
    })
    .min(1, 'Full name cannot be empty'),
  phone: z
    .string({
      required_error: 'Phone number is required',
      invalid_type_error: 'Phone number must be a string',
    })
    .min(1, 'Phone number cannot be empty'),
  addressLine1: z
    .string({
      required_error: 'Address line 1 is required',
      invalid_type_error: 'Address line 1 must be a string',
    })
    .min(1, 'Address line 1 cannot be empty'),
  addressLine2: z.string().optional(),
  city: z
    .string({
      required_error: 'City is required',
      invalid_type_error: 'City must be a string',
    })
    .min(1, 'City cannot be empty'),
  state: z
    .string({
      required_error: 'State is required',
      invalid_type_error: 'State must be a string',
    })
    .min(1, 'State cannot be empty'),
  postalCode: z
    .string({
      required_error: 'Postal code is required',
      invalid_type_error: 'Postal code must be a string',
    })
    .min(1, 'Postal code cannot be empty'),
  country: z
    .string({
      required_error: 'Country is required',
      invalid_type_error: 'Country must be a string',
    })
    .min(1, 'Country cannot be empty'),
});

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
    paymentMethod: z.enum(['COD', 'SurjoPay'], {
      required_error: 'Payment method is required',
      invalid_type_error: 'Payment method must be either COD or SurjoPay',
    }),
    paymentStatus: z.enum(['pending', 'completed', 'failed']).optional(),
    orderStatus: z.enum(['pending', 'completed', 'cancelled']).optional(),
    deliveryAddress: deliveryAddressSchema,
  }),
});

// Define the schema for updating an order (all fields are optional)
const updateOrderSchema = z.object({
  body: z.object({
    deliveryAddress: deliveryAddressSchema.optional(),
    paymentMethod: z.enum(['COD', 'SurjoPay']).optional(),
    paymentStatus: z.enum(['pending', 'completed', 'failed']).optional(),
    orderStatus: z.enum(['pending', 'completed', 'cancelled']).optional(),
  }),
});

// Export the schemas
export const OrderValidationSchema = {
  createOrderValidationSchema,
  updateOrderSchema,
};
