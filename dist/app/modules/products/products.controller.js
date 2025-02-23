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
exports.productController = void 0;
const products_services_1 = require("./products.services");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_ts_1 = require("http-status-ts");
/* Controller functions for the product module  */
// Function to create a new product
const createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parsedData = Object.assign(Object.assign({}, JSON.parse(req.body.data)), { image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    req.body = parsedData;
    const result = yield products_services_1.ProductServices.createProductDB(parsedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.CREATED,
        success: true,
        message: 'Bike created successfully',
        data: result,
    });
}));
// Function to get all products
const getAllProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield products_services_1.ProductServices.getAllProductsDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Bikes retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
}));
// Function to get a product by ID
const getProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get Academic Faculty by id
    const { productId } = req.params;
    const product = yield products_services_1.ProductServices.getProductDB(productId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Bike retrieved successfully',
        data: product,
    });
}));
// Function to update product details
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Update product details by id
    const { productId } = req.params;
    const updatedProduct = yield products_services_1.ProductServices.updateProductDB(productId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Bike updated successfully',
        data: updatedProduct,
    });
}));
// Function to delete a product from the database
const deleteProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete product by id
    const { productId } = req.params;
    yield products_services_1.ProductServices.deleteProductDB(productId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Bike deleted successfully',
    });
}));
// Export the controller functions
exports.productController = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
};
