import express from 'express';
import { orderController } from './orders.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidationSchema } from './orders.validation';
import { USER_ROLE } from '../user/user.constant';
const router = express.Router();

// verify payment
router.get('/verify', auth(USER_ROLE.customer), orderController.verifyPayment);

// Routes
router.post(
  '/',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  validateRequest(OrderValidationSchema.createOrderValidationSchema),
  orderController.createOrder,
);

router.get('/', auth(USER_ROLE.admin), orderController.getAllOrders);

router.get(
  '/my-orders',
  auth(USER_ROLE.customer),
  orderController.getOrdersByUser,
);

router.get('/:orderId', orderController.getOrder);

router.patch(
  '/:orderId',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  validateRequest(OrderValidationSchema.updateOrderSchema),
  orderController.updateOrder,
);

router.delete(
  '/:orderId',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  orderController.deleteOrder,
);

// Export the router
export const OrderRouter = router;
