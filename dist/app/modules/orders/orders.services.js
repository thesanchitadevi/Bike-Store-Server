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
exports.OrdersServices = void 0;
const http_status_ts_1 = require("http-status-ts");
const orders_model_1 = require("./orders.model");
const AppError_1 = require("../../AppError");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const orders_constant_1 = require("./orders.constant");
const orders_utils_1 = require("./orders.utils");
const products_model_1 = require("../products/products.model");
/* Database operations for orders */
// Create a new order in the database
const createOrderDB = (user, payload, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = payload === null || payload === void 0 ? void 0 : payload.products) === null || _a === void 0 ? void 0 : _a.length))
        throw new AppError_1.AppError(http_status_ts_1.HttpStatus.NOT_ACCEPTABLE, 'Order is not specified');
    const products = payload.products;
    const { totalPrice, productDetails } = yield (0, orders_utils_1.calculateTotalPriceAndValidateStock)(products);
    let order = yield orders_model_1.OrderModel.create({
        user: user._id,
        products: productDetails,
        totalPrice,
        deliveryAddress: {
            fullName: user.name,
            address: user.address,
            phone: user.phone,
        },
    });
    console.log('Order:', order._id);
    // payment gateway integration can be done here
    const shurjopayPayload = {
        amount: totalPrice,
        order_id: order._id,
        currency: 'BDT',
        customer_name: user.name,
        customer_address: user.address,
        customer_email: user.email,
        customer_city: user.city,
        customer_phone: user.phone,
        client_ip,
    };
    const payment = yield orders_utils_1.orderUtils.makePaymentAsync(shurjopayPayload);
    if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
        order = yield order.updateOne({
            transaction: {
                id: payment.sp_order_id,
                transactionStatus: payment.transactionStatus,
            },
        });
    }
    return payment.checkout_url;
});
// Verify payment using the shurjoPay API
const verifyPayment = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedPayment = yield orders_utils_1.orderUtils.verifyPaymentAsync(order_id);
    if (verifiedPayment.length) {
        yield orders_model_1.OrderModel.findOneAndUpdate({
            'transaction.id': order_id,
        }, {
            'transaction.bank_status': verifiedPayment[0].bank_status,
            'transaction.sp_code': verifiedPayment[0].sp_code,
            'transaction.sp_message': verifiedPayment[0].sp_message,
            'transaction.transactionStatus': verifiedPayment[0].transaction_status,
            'transaction.method': verifiedPayment[0].method,
            'transaction.date_time': verifiedPayment[0].date_time,
            status: verifiedPayment[0].bank_status == 'Success'
                ? 'Paid'
                : verifiedPayment[0].bank_status == 'Failed'
                    ? 'Pending'
                    : verifiedPayment[0].bank_status == 'Cancel'
                        ? 'Cancelled'
                        : '',
        });
    }
    return verifiedPayment;
});
// Get all orders from the database
const getAllOrdersDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const ordersQuery = new QueryBuilder_1.default(orders_model_1.OrderModel.find()
        .populate('user', 'name email')
        .populate('products.product', 'name price'), query)
        .search(orders_constant_1.OrderSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield ordersQuery.countTotal();
    const result = yield ordersQuery.modelQuery;
    return {
        meta,
        result,
    };
});
// Get order by ID from the database
const getOrderDB = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orders_model_1.OrderModel.findById(orderId)
        .populate('user', 'name email')
        .populate('products.product', 'name price');
    if (!order) {
        throw new AppError_1.AppError(http_status_ts_1.HttpStatus.NOT_FOUND, 'Order not found');
    }
    return order;
});
// Get orders by user from the database
const getOrdersByUserDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('User ID:', userId);
    const ordersQuery = new QueryBuilder_1.default(orders_model_1.OrderModel.find({ user: userId })
        .populate('user', 'name email')
        .populate('products.product', 'name price'), query)
        .sort()
        .paginate()
        .fields();
    const meta = yield ordersQuery.countTotal();
    const result = yield ordersQuery.modelQuery;
    if (!result.length) {
        throw new AppError_1.AppError(http_status_ts_1.HttpStatus.NOT_FOUND, 'No orders found');
    }
    return {
        meta,
        result,
    };
});
// Update order
const updateOrderDB = (orderId, userId, role, payload) => __awaiter(void 0, void 0, void 0, function* () {
    let query;
    if (role === 'admin') {
        // Admin can update any order
        query = { _id: orderId };
    }
    else {
        // User can only update their own orders
        query = { _id: orderId, user: userId };
    }
    // Define allowed fields for users and admins
    const update = {};
    if (role === 'admin') {
        // Admins can only update orderStatus
        if (payload.orderStatus) {
            update.orderStatus = payload.orderStatus;
        }
    }
    // Check for user updates (product quantity updates)
    if (payload.products && payload.products.length > 0) {
        let totalPrice = 0;
        for (const item of payload.products) {
            const product = yield products_model_1.ProductModel.findById(item.product);
            if (!product) {
                throw new AppError_1.AppError(http_status_ts_1.HttpStatus.NOT_FOUND, `Product with ID ${item.product} not found`);
            }
            // Find the order to get the existing product quantity
            const order = yield orders_model_1.OrderModel.findOne(query);
            if (!order) {
                throw new AppError_1.AppError(http_status_ts_1.HttpStatus.NOT_FOUND, 'Order not found or you do not have permission to update this order');
            }
            const existingProduct = order.products.find((orderItem) => orderItem.product.toString() === item.product.toString());
            const existingQuantity = existingProduct ? existingProduct.quantity : 0;
            const newQuantity = item.quantity;
            // Calculate quantity difference
            const quantityDifference = newQuantity - existingQuantity;
            if (quantityDifference > 0) {
                // If quantity is increased, check stock availability
                if (product.quantity < quantityDifference) {
                    throw new AppError_1.AppError(http_status_ts_1.HttpStatus.BAD_REQUEST, `Insufficient stock for product: ${product.name}`);
                }
                product.quantity -= quantityDifference;
            }
            else if (quantityDifference < 0) {
                // If quantity is decreased, restock the product
                product.quantity += Math.abs(quantityDifference);
            }
            // Save the updated product stock
            yield product.save();
            // Recalculate total price
            totalPrice += product.price * item.quantity;
        }
        update.products = payload.products;
        update.totalPrice = totalPrice;
    }
    // Update the order directly in the database
    const updatedOrder = yield orders_model_1.OrderModel.findOneAndUpdate(query, { $set: update }, { new: true });
    if (!updatedOrder) {
        throw new AppError_1.AppError(http_status_ts_1.HttpStatus.NOT_FOUND, 'Order not found or you do not have permission to update this order');
    }
    return updatedOrder;
});
// Delete order
const deleteOrderDB = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orders_model_1.OrderModel.findByIdAndDelete({
        _id: orderId,
    });
    if (!order) {
        throw new AppError_1.AppError(http_status_ts_1.HttpStatus.NOT_FOUND, 'Order not found');
    }
    // Restore stock for all products in the order
    for (const item of order.products) {
        const product = yield products_model_1.ProductModel.findById(item.product);
        if (product) {
            product.quantity += item.quantity; // Restore the stock
            yield product.save();
        }
        else {
            throw new AppError_1.AppError(http_status_ts_1.HttpStatus.NOT_FOUND, `Product with ID ${item.product} not found`);
        }
    }
    return order;
});
// Export the functions to be used in the controller
exports.OrdersServices = {
    createOrderDB,
    getAllOrdersDB,
    verifyPayment,
    getOrderDB,
    getOrdersByUserDB,
    updateOrderDB,
    deleteOrderDB,
};
