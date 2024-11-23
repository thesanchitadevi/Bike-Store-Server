import express from 'express';
import { orderController } from './orders.controller';

const router = express.Router();

// Routes
router.post('/', orderController.placeOrder);

// Export the router
export const OrderRouter = router;
