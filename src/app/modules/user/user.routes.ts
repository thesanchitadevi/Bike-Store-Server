import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';

import { AdminValidations } from '../admin/admin.validation';

const router = express.Router();

// create admin
router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

// won't return object as router itself is an object
export const UserRouter = router;
