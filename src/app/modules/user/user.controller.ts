import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import { HttpStatus } from 'http-status-ts';

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminDB(password, adminData);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Admin is created succesfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const user = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: `${role} id: ${userId} found successfully`,
    data: user,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Status changed successfully',
    data: result,
  });
});

export const UserControllers = {
  createAdmin,
  getMe,
  changeStatus,
};
