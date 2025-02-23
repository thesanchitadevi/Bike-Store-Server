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
exports.orderUtils = exports.calculateTotalPriceAndValidateStock = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_ts_1 = require("http-status-ts");
const AppError_1 = require("../../errors/AppError");
const products_model_1 = require("../products/products.model");
const shurjopay_1 = __importDefault(require("shurjopay"));
const config_1 = __importDefault(require("../../config"));
// Function to calculate the total price and validate product availability
const calculateTotalPriceAndValidateStock = (products) => __awaiter(void 0, void 0, void 0, function* () {
    let totalPrice = 0;
    const productDetails = [];
    for (const item of products) {
        const product = yield products_model_1.ProductModel.findById(item.product);
        // Check if the product exists
        if (!product) {
            throw new AppError_1.AppError(http_status_ts_1.HttpStatus.NOT_FOUND, `Product with ID ${item.product} not found`);
        }
        // Check if there is enough stock
        if (product.quantity < item.quantity) {
            throw new AppError_1.AppError(http_status_ts_1.HttpStatus.BAD_REQUEST, `Insufficient stock for product: ${product.name}`);
        }
        // Calculate subtotal and update total price
        const subtotal = product.price * item.quantity;
        totalPrice += subtotal;
        // Add product details to the array
        productDetails.push({
            product: item.product,
            quantity: item.quantity,
            price: product.price, // Include the price of the product at the time of order
        });
        // Reduce stock for the product
        yield product.reduceStock(item.quantity);
    }
    return { totalPrice, productDetails };
});
exports.calculateTotalPriceAndValidateStock = calculateTotalPriceAndValidateStock;
// SurjoPay payment gateway integration
const shurjopay = new shurjopay_1.default();
shurjopay.config(config_1.default.sp_endpoint, config_1.default.sp_username, config_1.default.sp_password, config_1.default.sp_prefix, config_1.default.sp_return_url);
const makePaymentAsync = (paymentPayload) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        shurjopay.makePayment(paymentPayload, (response) => resolve(response), (error) => reject(error));
    });
    // const paymentResult = await shurjopay.makePayment(
    //   paymentPayload,
    //   (response) => console.log(response),
    //   (error) => console.log(error),
    // );
    // return paymentResult;
});
const verifyPaymentAsync = (order_id) => {
    return new Promise((resolve, reject) => {
        shurjopay.verifyPayment(order_id, (response) => resolve(response), (error) => reject(error));
    });
};
exports.orderUtils = {
    makePaymentAsync,
    verifyPaymentAsync,
};
