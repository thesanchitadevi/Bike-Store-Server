import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validate';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { AdminValidations } from '../admin/admin.validation';

const router = express.Router();

// create admin
router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

// change status
router.post(
  '/change-status/:id',
  auth('admin'),
  validateRequest(UserValidations.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

// won't return object as router itself is an object
export const UserRouter = router;
