import express from 'express';
import { productController } from './products.controller';

const router = express.Router();

// Routes
router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:productId', productController.getProduct);
router.put('/:productId', productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);

// Export the router
export const ProductRouter = router;
