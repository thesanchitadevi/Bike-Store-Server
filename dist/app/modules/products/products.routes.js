"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRouter = void 0;
const express_1 = __importDefault(require("express"));
const products_controller_1 = require("./products.controller");
const router = express_1.default.Router();
router.post('/create-product', products_controller_1.productController.createProduct);
// router.get('/', productController.getAllProducts);
// router.get('/:id', productController.getProduct);
// router.delete('/:id', productController.deleteProduct);
// won't return object as router itself is an object
exports.ProductRouter = router;
