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
exports.getProductServices = void 0;
const products_model_1 = require("../products.model");
/* Database operations for products */
// Create a new product in the database
const createProductDB = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newProduct = yield products_model_1.ProductModel.create(productData);
        return newProduct;
    }
    catch (error) {
        throw error;
    }
});
// Get all products from the database
const getAllProductsDB = (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let filter = {}; // Default filter for no search term
        if (searchTerm) {
            filter = {
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for name
                    { brand: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for brand
                    { category: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search for category
                ],
            };
        }
        const allProducts = yield products_model_1.ProductModel.find(filter);
        return allProducts;
    }
    catch (error) {
        throw new Error('Error retrieving bikes from the database');
    }
});
// Get a single product from the database
const getProductDB = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield products_model_1.ProductModel.findOne({ _id: productId });
        return product;
    }
    catch (error) {
        throw error;
    }
});
// Update a product in the database
const updateProductDB = (productId_1, updateData_1, ...args_1) => __awaiter(void 0, [productId_1, updateData_1, ...args_1], void 0, function* (productId, updateData, options = {}) {
    try {
        const updatedProduct = yield products_model_1.ProductModel.findByIdAndUpdate({ _id: productId }, // Find product by ID
        updateData, Object.assign({ new: true }, options));
        return updatedProduct;
    }
    catch (error) {
        throw error;
    }
});
// Delete a product from the database
const deleteProductDB = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedproduct = yield products_model_1.ProductModel.findByIdAndDelete({
            _id: productId,
        });
        return deletedproduct;
    }
    catch (error) {
        throw error;
    }
});
// Export the functions to be used in the controller
exports.getProductServices = {
    createProductDB,
    getAllProductsDB,
    getProductDB,
    updateProductDB,
    deleteProductDB,
};
