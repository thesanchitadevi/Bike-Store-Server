import express from 'express';
import { orderController } from './orders.controller';
import auth from '../../middlewares/auth';
const router = express.Router();

// Routes
// router.post(
//   '/',
//   auth(USER_ROLE.user, USER_ROLE.admin),
//   validateRequest(OrderValidationSchema.createOrderValidationSchema),
//   orderController.createOrder,
// );
router.get('/', auth('admin'), orderController.getAllOrders);

router.get('/:orderId', auth('admin'), orderController.getOrder);

router.get('/my-orders', auth('user'), orderController.getOrdersByUser);

// Export the router
export const OrderRouter = router;
