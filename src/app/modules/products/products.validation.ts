import { z } from 'zod';

const createProductValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Product name is required',
        invalid_type_error: 'Product name must be a string',
      })
      .min(1, 'Product name cannot be empty'),

    brand: z
      .string({
        required_error: 'Brand is required',
        invalid_type_error: 'Brand must be a string',
      })
      .min(1, 'Brand cannot be empty'),

    model: z
      .string({
        required_error: 'Model is required',
        invalid_type_error: 'Model must be a string',
      })
      .min(1, 'Model cannot be empty'),

    price: z
      .number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a number',
      })
      .min(0, 'Price must be a positive value'),

    category: z.enum(['Mountain', 'Road', 'Hybrid', 'Electric'], {
      required_error: 'Category is required',
      invalid_type_error:
        'Invalid category. Must be one of: Mountain, Road, Hybrid, Electric',
    }),

    description: z
      .string({
        required_error: 'Description is required',
        invalid_type_error: 'Description must be a string',
      })
      .min(1, 'Description cannot be empty'),

    quantity: z
      .number({
        required_error: 'Quantity is required',
        invalid_type_error: 'Quantity must be a number',
      })
      .min(0, 'Quantity must be greater than or equal to zero'),

    image: z.string(),
    inStock: z
      .boolean({
        invalid_type_error: 'inStock must be a boolean',
      })
      .optional(),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Product name must be a string',
      })
      .min(1, 'Product name cannot be empty')
      .optional(),

    brand: z
      .string({
        invalid_type_error: 'Brand must be a string',
      })
      .min(1, 'Brand cannot be empty')
      .optional(),

    model: z
      .string({
        invalid_type_error: 'Model must be a string',
      })
      .min(1, 'Model cannot be empty')
      .optional(),

    price: z
      .number({
        invalid_type_error: 'Price must be a number',
      })
      .min(0, 'Price must be a positive value')
      .optional(),

    category: z
      .enum(['Mountain', 'Road', 'Hybrid', 'Electric'], {
        invalid_type_error:
          'Invalid category. Must be one of: Mountain, Road, Hybrid, Electric',
      })
      .optional(),

    description: z
      .string({
        invalid_type_error: 'Description must be a string',
      })
      .min(1, 'Description cannot be empty')
      .optional(),

    quantity: z
      .number({
        invalid_type_error: 'Quantity must be a number',
      })
      .min(0, 'Quantity must be greater than or equal to zero')
      .optional(),

    inStock: z
      .boolean({
        invalid_type_error: 'inStock must be a boolean',
      })
      .optional(),
  }),
});

export const ProductValidationSchema = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
