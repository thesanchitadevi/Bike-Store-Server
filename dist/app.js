"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Code for the app
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const products_routes_1 = require("./app/modules/products/products.routes");
const orders_routes_1 = require("./app/modules/orders/orders.routes");
const app = (0, express_1.default)();
//parse application/json
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// application routes
// Product routes
app.use('/api/products', products_routes_1.ProductRouter);
// Order routes
app.use('/api/orders', orders_routes_1.OrderRouter);
// Default route
const getController = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the Bike Store API',
    });
};
app.get('/', getController);
exports.default = app;
