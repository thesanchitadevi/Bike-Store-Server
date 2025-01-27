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

export const UserControllers = {
  createAdmin,
};
