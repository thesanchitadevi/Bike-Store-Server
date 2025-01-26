import express from 'express';
import { productController } from './products.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidationSchema } from './products.validation';

const router = express.Router();

// Routes
router.post(
  '/',
  validateRequest(ProductValidationSchema.createProductValidationSchema),
  productController.createProduct,
);
router.get('/', productController.getAllProducts);
router.get('/:productId', productController.getProduct);
router.put('/:productId', productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);

// Export the router
export const ProductRouter = router;
