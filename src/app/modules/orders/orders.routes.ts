import express from 'express';
import { orderController } from './orders.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidationSchema } from './orders.validation';
import { USER_ROLE } from '../user/user.constant';
const router = express.Router();

// Routes
router.post(
  '/',
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(OrderValidationSchema.createOrderValidationSchema),
  orderController.createOrder,
);

router.get('/', orderController.getAllOrders);
router.get('/my-orders', auth(USER_ROLE.user), orderController.getOrdersByUser);

// verify payment
router.get('/verify', auth(USER_ROLE.user), orderController.verifyPayment);

router.get('/:orderId', orderController.getOrder);

// Export the router
export const OrderRouter = router;
