import { z } from 'zod';

const productValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  category: z.enum(['Mountain', 'Road', 'Hybrid', 'Electric'], {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0, 'Quantity must be a non-negative number'),
  inStock: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export default productValidationSchema;
