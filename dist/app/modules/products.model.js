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
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
// Product schema
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive value'],
    },
    category: {
        type: String,
        enum: ['Mountain', 'Road', 'Hybrid', 'Electric'],
        message: 'Invalid category',
        required: true,
    },
    description: { type: String, required: true },
    quantity: {
        type: Number,
        required: true,
        min: [0, 'Quantity must be greater than or equal to zero'],
    },
    inStock: { type: Boolean, default: true },
}, {
    versionKey: false, // Don't add a version key to the document
    timestamps: true, // Add timestamps for createdAt and updatedAt
});
// Static method to check if a product exists
productSchema.statics.isProductExist = function (productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const existProduct = yield exports.ProductModel.findOne({ _id: productId });
        return existProduct;
    });
};
// Instance method to reduce stock
productSchema.methods.reduceStock = function (orderQuantity) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.quantity < orderQuantity) {
            throw new Error('Insufficient stock');
        }
        this.quantity -= orderQuantity;
        this.inStock = this.quantity > 0;
        yield this.save();
    });
};
// Compile the schema into a model
exports.ProductModel = (0, mongoose_1.model)('Product', productSchema);
