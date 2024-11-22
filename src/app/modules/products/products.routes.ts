import express from 'express';
import { productController } from './products.controller';

const router = express.Router();

router.post('/create-product', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:productId', productController.getProduct);
router.put('/:productId', productController.updateProduct);
// router.delete('/:id', productController.deleteProduct);

// won't return object as router itself is an object
export const ProductRouter = router;
