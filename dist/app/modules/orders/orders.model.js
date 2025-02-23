"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
// Order schema
const OrderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Product',
                required: [true, 'Product ID is required'],
            },
            quantity: {
                type: Number,
                required: [true, 'Quantity is required'],
                min: [1, 'Quantity must be at least 1'],
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: [true, 'Total price is required'],
        min: [0, 'Total price must be a positive value'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Cancelled'],
        default: 'Pending',
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
        default: 'Pending',
    },
    deliveryAddress: {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
        },
    },
    transaction: {
        id: String,
        transactionStatus: String,
        bank_status: String,
        sp_code: String,
        sp_message: String,
        method: String,
        date_time: String,
    },
}, {
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the version key (__v)
});
exports.OrderModel = (0, mongoose_1.model)('Order', OrderSchema);
