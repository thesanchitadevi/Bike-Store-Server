import express from 'express';
import { productController } from './products.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidationSchema } from './products.validation';
import auth from '../../middlewares/auth';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

// Routes
router.post(
  '/',
  auth('admin'),
  multerUpload.single('file'),
  // validateRequest(ProductValidationSchema.createProductValidationSchema),
  productController.createProduct,
);
router.get('/', productController.getAllProducts);
router.get('/:productId', productController.getProduct);
router.put(
  '/:productId',
  auth('admin'),
  validateRequest(ProductValidationSchema.updateProductValidationSchema),
  productController.updateProduct,
);
router.delete('/:productId', productController.deleteProduct);

// Export the router
export const ProductRouter = router;
