"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const express_1 = __importDefault(require("express"));
const orders_controller_1 = require("./orders.controller");
const router = express_1.default.Router();
// Routes
router.post('/', orders_controller_1.orderController.placeOrder);
router.get('/revenue', orders_controller_1.orderController.getRevenue);
// Export the router
exports.OrderRouter = router;
