import express from 'express';
import { orderController } from './orders.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidationSchema } from './orders.validation';

const router = express.Router();

// Routes
router.post(
  '/',
  validateRequest(OrderValidationSchema.createOrderValidationSchema),
  orderController.createOrder,
);
router.get('/', orderController.getAllOrders);

router.get('/:orderId', orderController.getOrder);

// Export the router
export const OrderRouter = router;
