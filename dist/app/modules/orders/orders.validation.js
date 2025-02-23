"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidationSchema = void 0;
const zod_1 = require("zod");
// Define the schema for creating an order
const createOrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        products: zod_1.z.array(zod_1.z.object({
            product: zod_1.z.string({
                required_error: 'Product ID is required',
                invalid_type_error: 'Product ID must be a string',
            }),
            quantity: zod_1.z
                .number({
                required_error: 'Quantity is required',
                invalid_type_error: 'Quantity must be a number',
            })
                .min(1, 'Quantity must be at least 1'),
        })),
    }),
});
// Define the schema for updating an order (all fields are optional)
const updateOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        products: zod_1.z
            .array(zod_1.z.object({
            product: zod_1.z.string({
                required_error: 'Product ID is required',
                invalid_type_error: 'Product ID must be a string',
            }),
            quantity: zod_1.z
                .number({
                required_error: 'Quantity is required',
                invalid_type_error: 'Quantity must be a number',
            })
                .min(1, 'Quantity must be at least 1'),
        }))
            .optional(),
        orderStatus: zod_1.z
            .enum(['Pending', 'Processing', 'Shipped', 'Delivered'])
            .optional(),
    }),
});
// Export the schemas
exports.OrderValidationSchema = {
    createOrderValidationSchema,
    updateOrderSchema,
};
