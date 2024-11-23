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
exports.productController = void 0;
const products_services_1 = require("./products.services");
/* Controller functions for the product module  */
// Function to create a new product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = req.body;
        const newProduct = yield products_services_1.getProductServices.createProductDB(product);
        res.status(201).json({
            message: 'Bike created successfully',
            status: true,
            data: newProduct,
        });
    }
    catch (error) {
        // Check if the error is a Mongoose validation error
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
                        min: err.properties.min, // Minimum value
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
        else {
            // General error handling
            res.status(500).json({
                message: 'Error in creating product',
                success: false,
                error: error.message || 'An unknown error occurred',
                stack: process.env.NODE_ENV === 'development' ? error.stack : null,
            });
        }
    }
});
// Function to get all products
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the searchTerm from the query string
        const { searchTerm } = req.query;
        // Check if the searchTerm is a string
        const searchTermString = typeof searchTerm === 'string' ? searchTerm : undefined;
        const allProducts = yield products_services_1.getProductServices.getAllProductsDB(searchTermString);
        // Handle case where no products are found
        if (!allProducts || allProducts.length === 0) {
            res.status(404).json({
                status: false,
                message: 'No bikes found',
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: 'Bikes retrieved successfully',
            data: allProducts,
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
                        min: err.properties.min, // Minimum value
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
        // General error handling
        res.status(500).json({
            status: false,
            message: 'Error retrieving bikes',
            error: error.message || 'An unknown error occurred',
        });
    }
});
// Function to get a product by ID
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const product = yield products_services_1.getProductServices.getProductDB(productId);
        // Handle case where the product is not found
        if (!product) {
            throw new Error('Resource not found');
        }
        res.status(200).json({
            status: true,
            message: 'Bike retrieved successfully',
            data: product,
        });
    }
    catch (error) {
        // If the error is "Resource not found"
        if (error.message === 'Resource not found') {
            res.status(404).json({
                message: 'Resource not found',
                success: false,
                error: {
                    name: 'NotFoundError',
                    message: 'The requested resource could not be found',
                },
                stack: process.env.NODE_ENV === 'development' ? error.stack : null,
            });
            return;
        }
        // General error handling f
        res.status(500).json({
            status: false,
            message: 'Error retrieving the bike',
            error: error.message || 'An unknown error occurred',
        });
    }
});
// Function to update product details
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const updatedProduct = yield products_services_1.getProductServices.updateProductDB(productId, req);
        // Handle case where the product is not found
        if (!updatedProduct) {
            throw new Error('Resource not found');
        }
        res.status(200).json({
            status: true,
            message: 'Bike updated successfully',
            data: updatedProduct,
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
            res.status(404).json({
                message: 'Resource not found',
                success: false,
                error: {
                    name: 'NotFoundError',
                    message: 'The requested resource could not be found',
                },
                stack: process.env.NODE_ENV === 'development' ? error.stack : null,
            });
        }
        // General error handling
        res.status(500).json({
            status: false,
            message: 'An error occurred while updating the bike',
            error: error.message || 'An unknown error occurred',
            stack: process.env.NODE_ENV === 'development' ? error.stack : null,
        });
    }
});
// Function to delete a product from the database
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        const deletedProduct = yield products_services_1.getProductServices.deleteProductDB(productId);
        // Handle case where the product is not found
        if (!deletedProduct) {
            throw new Error('Resource not found');
        }
        res.status(200).json({
            message: 'Bike deleted successfully',
            status: true,
            data: {},
        });
    }
    catch (error) {
        // If the error is "Resource not found"
        if (error.message === 'Resource not found') {
            res.status(404).json({
                message: 'Resource not found',
                success: false,
                error: {
                    name: 'NotFoundError',
                    message: 'The requested resource could not be found',
                },
                stack: process.env.NODE_ENV === 'development' ? error.stack : null,
            });
            return;
        }
        // General error handling
        res.status(500).json({
            success: false,
            message: 'Error deleting the bike',
            error: error.message || 'An unknown error occurred',
        });
    }
});
// Export the controller functions
exports.productController = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
};
