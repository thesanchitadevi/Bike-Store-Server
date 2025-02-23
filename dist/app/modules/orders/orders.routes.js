"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const express_1 = __importDefault(require("express"));
const orders_controller_1 = require("./orders.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const orders_validation_1 = require("./orders.validation");
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
// verify payment
router.get('/verify', (0, auth_1.default)(user_constant_1.USER_ROLE.customer), orders_controller_1.orderController.verifyPayment);
// Routes
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.customer, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(orders_validation_1.OrderValidationSchema.createOrderValidationSchema), orders_controller_1.orderController.createOrder);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), orders_controller_1.orderController.getAllOrders);
router.get('/my-orders', (0, auth_1.default)(user_constant_1.USER_ROLE.customer), orders_controller_1.orderController.getOrdersByUser);
router.get('/:orderId', orders_controller_1.orderController.getOrder);
router.patch('/:orderId', (0, auth_1.default)(user_constant_1.USER_ROLE.customer, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(orders_validation_1.OrderValidationSchema.updateOrderSchema), orders_controller_1.orderController.updateOrder);
router.delete('/:orderId', (0, auth_1.default)(user_constant_1.USER_ROLE.customer, user_constant_1.USER_ROLE.admin), orders_controller_1.orderController.deleteOrder);
// Export the router
exports.OrderRouter = router;
