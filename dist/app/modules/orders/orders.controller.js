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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const orders_services_1 = require("./orders.services");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_ts_1 = require("http-status-ts");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = require("../../errors/AppError");
/* Controller functions for the product module  */
// Function to place an order
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const payload = req.body;
    const result = yield orders_services_1.OrdersServices.createOrderDB(user, payload, req.ip);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.CREATED,
        success: true,
        message: 'Order placed successfully',
        data: result,
    });
}));
// Function to get all orders
const getAllOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orders_services_1.OrdersServices.getAllOrdersDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Orders retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
}));
const verifyPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orders_services_1.OrdersServices.verifyPayment(req.query.order_id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.CREATED,
        success: true,
        message: 'Order verified successfully',
        data: order,
    });
}));
// Function to get an order by ID
const getOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const result = yield orders_services_1.OrdersServices.getOrderDB(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Order retrieved successfully',
        data: result,
    });
}));
// Function to get orders by user
const getOrdersByUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('getOrdersByUser route hit');
    const user = req.user;
    console.log('User:', user);
    const result = yield orders_services_1.OrdersServices.getOrdersByUserDB(user._id, req.query);
    if (!mongoose_1.default.Types.ObjectId.isValid(user._id)) {
        throw new AppError_1.AppError(http_status_ts_1.HttpStatus.BAD_REQUEST, 'Invalid user ID');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Orders retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
}));
// Function to update an order
const updateOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const user = req.user;
    const result = yield orders_services_1.OrdersServices.updateOrderDB(orderId, user._id, user.role, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Order updated successfully',
        data: result,
    });
}));
// Function to delete an order
const deleteOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    // const user = req.user;
    yield orders_services_1.OrdersServices.deleteOrderDB(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Order deleted successfully',
    });
}));
// Export the controller functions
exports.orderController = {
    createOrder,
    verifyPayment,
    getAllOrders,
    getOrder,
    getOrdersByUser,
    updateOrder,
    deleteOrder,
};
