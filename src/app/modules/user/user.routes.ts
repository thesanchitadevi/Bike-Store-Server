import express from 'express';
import { userControllers } from './user.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Get all users route - admin only
router.get('/', auth('admin'), userControllers.getAllUsers);

// Block user route - admin only
router.patch(
  '/users/:userId/block',
  auth('admin'),
  userControllers.blockUserHandle,
);

export const UserRouter = router;
