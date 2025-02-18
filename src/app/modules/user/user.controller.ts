import { HttpStatus } from 'http-status-ts';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const getAllUsers = catchAsync(async (req, res) => {
  const users = await UserServices.getAllUsers();

  sendResponse(res, {
    success: true,
    message: 'All users fetched successfully',
    data: users,
    statusCode: HttpStatus.OK,
  });
});
const blockUserHandle = catchAsync(async (req, res) => {
  await UserServices.blockUserHandleFromDB(req.params.userId);

  sendResponse(res, {
    success: true,
    message: 'User blocked successfully',
    statusCode: HttpStatus.OK,
  });
});

export const userControllers = {
  getAllUsers,
  blockUserHandle,
};
