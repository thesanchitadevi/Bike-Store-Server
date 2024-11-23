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
exports.getOrdersServices = void 0;
const orders_model_1 = require("../orders.model");
const products_model_1 = require("../products.model");
/* Database operations for orders */
// Create a new order in the database
const createOrderDB = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { product: productId, quantity } = orderData;
        const product = yield products_model_1.ProductModel.isProductExist(productId.toString());
        if (!product) {
            throw new Error('Resource not found');
        }
        // Reduce stock
        yield product.reduceStock(quantity);
        const newOrder = yield orders_model_1.OrderModel.create(orderData);
        if (!newOrder || newOrder.quantity < orderData.quantity) {
            throw new Error('Insufficient stock or product not found');
        }
        return newOrder;
    }
    catch (error) {
        throw error;
    }
});
// Calculate total revenue from all orders
const calculateTotalRevenue = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // MongoDB aggregation pipeline to calculate total revenue
        const revenueData = yield orders_model_1.OrderModel.aggregate([
            {
                $lookup: {
                    from: 'products', // The products collection
                    localField: 'product', // The field in the orders collection
                    foreignField: '_id', // The field in the products collection
                    as: 'productDetails', // Alias for the joined data
                },
            },
            {
                $unwind: '$productDetails', // Unwind the product details to access individual fields
            },
            {
                $addFields: {
                    totalPrice: { $multiply: ['$productDetails.price', '$quantity'] }, // Multiply price by quantity
                },
            },
            {
                $group: {
                    _id: null, // Group all orders together
                    totalRevenue: { $sum: '$totalPrice' }, // Sum the totalPrice field to get total revenue
                },
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the result
                    totalRevenue: 1, // Only include totalRevenue in the response
                },
            },
        ]);
        // Return total revenue or 0 if no revenue data is found
        return revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    }
    catch (error) {
        throw new Error('Error calculating revenue: ' + error.message);
    }
});
// Export the functions to be used in the controller
exports.getOrdersServices = {
    createOrderDB,
    calculateTotalRevenue,
};
