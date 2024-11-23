"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const orders_services_1 = require("./orders.services");
/* Controller functions for the product module  */
// Function to place an order
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = req.body;
        const newOrder = yield orders_services_1.getOrdersServices.createOrderDB(order);
        res.status(201).json({
            message: 'Order created successfully',
            status: true,
            data: newOrder,
        });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            // Map Mongoose validation error to the required structure
            const validationErrors = Object.keys(error.errors).reduce((acc, key) => {
                const err = error.errors[key];
                acc[key] = {
                    message: err.message,
                    name: err.name,
                    properties: {
                        message: err.message,
                        type: err.properties.type, // Validation type (e.g., 'required', 'min')
                        min: err.properties.min, // Minimum value (if applicable)
                    },
                    kind: err.kind, // Validation kind (e.g., 'required', 'min')
                    path: err.path, // Path of the field (e.g., 'price')
                    value: req.body[key], // The invalid value
                };
                return acc;
            }, {});
            // Respond with validation errors
            res.status(400).json({
                message: 'Validation failed',
                success: false,
                error: {
                    name: error.name,
                    errors: validationErrors,
                },
                stack: process.env.NODE_ENV === 'development' ? error.stack : null,
            });
        }
        // Handle "Resource not found" error
        if (error.message === 'Resource not found') {
            const resourceNotFoundError = {
                resource: error.resource || 'Unknown Resource',
                message: error.message || 'Resource not found',
                name: error.name,
            };
            res.status(404).json({
                message: 'Resource not found',
                success: false,
                error: {
                    name: resourceNotFoundError.name,
                    details: resourceNotFoundError,
                },
                stack: process.env.NODE_ENV === 'development' ? error.stack : null,
            });
        }
    }
});
// Function to get the total revenue
const getRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalRevenue = yield orders_services_1.getOrdersServices.calculateTotalRevenue();
        res.status(200).json({
            message: 'Revenue calculated successfully',
            status: true,
            data: {
                totalRevenue,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error calculating revenue',
            success: false,
            error: error.message || 'An unknown error occurred',
            stack: process.env.NODE_ENV === 'development' ? error.stack : null,
        });
    }
});
// Export the controller functions
exports.orderController = {
    placeOrder,
    getRevenue,
};
