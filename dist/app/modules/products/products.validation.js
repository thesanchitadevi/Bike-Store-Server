"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidationSchema = void 0;
const zod_1 = require("zod");
const createProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Product name is required',
            invalid_type_error: 'Product name must be a string',
        })
            .min(1, 'Product name cannot be empty'),
        brand: zod_1.z
            .string({
            required_error: 'Brand is required',
            invalid_type_error: 'Brand must be a string',
        })
            .min(1, 'Brand cannot be empty'),
        model: zod_1.z
            .string({
            required_error: 'Model is required',
            invalid_type_error: 'Model must be a string',
        })
            .min(1, 'Model cannot be empty'),
        price: zod_1.z
            .number({
            required_error: 'Price is required',
            invalid_type_error: 'Price must be a number',
        })
            .min(0, 'Price must be a positive value'),
        category: zod_1.z.enum(['Mountain', 'Road', 'Hybrid', 'Electric'], {
            required_error: 'Category is required',
            invalid_type_error: 'Invalid category. Must be one of: Mountain, Road, Hybrid, Electric',
        }),
        description: zod_1.z
            .string({
            required_error: 'Description is required',
            invalid_type_error: 'Description must be a string',
        })
            .min(1, 'Description cannot be empty'),
        quantity: zod_1.z
            .number({
            required_error: 'Quantity is required',
            invalid_type_error: 'Quantity must be a number',
        })
            .min(0, 'Quantity must be greater than or equal to zero'),
        image: zod_1.z.string(),
        inStock: zod_1.z
            .boolean({
            invalid_type_error: 'inStock must be a boolean',
        })
            .optional(),
    }),
});
const updateProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            invalid_type_error: 'Product name must be a string',
        })
            .min(1, 'Product name cannot be empty')
            .optional(),
        brand: zod_1.z
            .string({
            invalid_type_error: 'Brand must be a string',
        })
            .min(1, 'Brand cannot be empty')
            .optional(),
        model: zod_1.z
            .string({
            invalid_type_error: 'Model must be a string',
        })
            .min(1, 'Model cannot be empty')
            .optional(),
        price: zod_1.z
            .number({
            invalid_type_error: 'Price must be a number',
        })
            .min(0, 'Price must be a positive value')
            .optional(),
        category: zod_1.z
            .enum(['Mountain', 'Road', 'Hybrid', 'Electric'], {
            invalid_type_error: 'Invalid category. Must be one of: Mountain, Road, Hybrid, Electric',
        })
            .optional(),
        description: zod_1.z
            .string({
            invalid_type_error: 'Description must be a string',
        })
            .min(1, 'Description cannot be empty')
            .optional(),
        quantity: zod_1.z
            .number({
            invalid_type_error: 'Quantity must be a number',
        })
            .min(0, 'Quantity must be greater than or equal to zero')
            .optional(),
        inStock: zod_1.z
            .boolean({
            invalid_type_error: 'inStock must be a boolean',
        })
            .optional(),
    }),
});
exports.ProductValidationSchema = {
    createProductValidationSchema,
    updateProductValidationSchema,
};
