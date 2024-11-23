"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRouter = void 0;
const express_1 = __importDefault(require("express"));
const products_controller_1 = require("./products.controller");
const router = express_1.default.Router();
// Routes
router.post('/', products_controller_1.productController.createProduct);
router.get('/', products_controller_1.productController.getAllProducts);
router.get('/:productId', products_controller_1.productController.getProduct);
router.put('/:productId', products_controller_1.productController.updateProduct);
router.delete('/:productId', products_controller_1.productController.deleteProduct);
// Export the router
exports.ProductRouter = router;
