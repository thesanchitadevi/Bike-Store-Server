import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { updateAdminValidationSchema } from './admin.validation';
import { AdminControllers } from './admin.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', auth('admin'), AdminControllers.getAllAdmins);

router.get('/:id', AdminControllers.getSingleAdmin);

router.patch(
  '/:id',
  validateRequest(updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);

router.delete('/:adminId', AdminControllers.deleteAdmin);

// Block user route - admin only
router.patch(
  '/users/:userId/block',
  auth('admin'),
  AdminControllers.blockUserHandle,
);

export const AdminRouter = router;
