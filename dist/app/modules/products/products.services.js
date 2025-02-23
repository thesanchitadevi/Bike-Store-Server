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
exports.ProductServices = void 0;
const http_status_ts_1 = require("http-status-ts");
const AppError_1 = require("../../AppError");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const products_constant_1 = require("./products.constant");
const products_model_1 = require("./products.model");
/* Database operations for products */
// Create a new product in the database
const createProductDB = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const newProduct = yield products_model_1.ProductModel.create(productData);
    return newProduct;
});
// Get all products from the database
const getAllProductsDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const productsQuery = new QueryBuilder_1.default(products_model_1.ProductModel.find(), query)
        .search(products_constant_1.ProductSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield productsQuery.countTotal();
    const result = yield productsQuery.modelQuery;
    return {
        meta,
        result,
    };
});
// Get a single product from the database
const getProductDB = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield products_model_1.ProductModel.findById(productId);
    if (!product) {
        throw new AppError_1.AppError(http_status_ts_1.HttpStatus.NOT_FOUND, 'Product not found');
    }
    return product;
});
// Update a product in the database
const updateProductDB = (productId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedProduct = yield products_model_1.ProductModel.findByIdAndUpdate({ _id: productId }, // Find product by ID
    updateData, // Update the product with the provided data
    { new: true, runValidators: true });
    if (!updatedProduct) {
        throw new AppError_1.AppError(http_status_ts_1.HttpStatus.NOT_FOUND, 'Product not found');
    }
    return updatedProduct;
});
// Delete a product from the database
const deleteProductDB = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedProduct = yield products_model_1.ProductModel.findByIdAndDelete(productId);
    if (!deletedProduct) {
        throw new AppError_1.AppError(http_status_ts_1.HttpStatus.NOT_FOUND, 'Product not found');
    }
    return deletedProduct;
});
// Export the functions to be used in the controller
exports.ProductServices = {
    createProductDB,
    getAllProductsDB,
    getProductDB,
    updateProductDB,
    deleteProductDB,
};
