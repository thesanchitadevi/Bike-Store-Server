"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const productValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    brand: zod_1.z.string().min(1, 'Brand is required'),
    price: zod_1.z.number().min(0, 'Price must be a positive number'),
    category: zod_1.z.enum(['Mountain', 'Road', 'Hybrid', 'Electric'], {
        errorMap: () => ({ message: 'Invalid category' }),
    }),
    description: zod_1.z.string().min(1, 'Description is required'),
    quantity: zod_1.z.number().min(0, 'Quantity must be a non-negative number'),
    inStock: zod_1.z.boolean(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.default = productValidationSchema;
