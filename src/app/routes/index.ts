import { Router } from 'express';
import { ProductRouter } from '../modules/products/products.routes';
import { OrderRouter } from '../modules/orders/orders.routes';
import { AuthRouter } from '../modules/authentication/auth.routes';
import { UserRouter } from '../modules/user/user.routes';

const router = Router();

// Application routes
const moduleRoutes = [
  {
    path: '/auth',
    module: AuthRouter,
  },
  {
    path: '/admin',
    module: UserRouter,
  },
  {
    path: '/products',
    module: ProductRouter,
  },
  {
    path: '/orders',
    module: OrderRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.module);
});

export default router;
