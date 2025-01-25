/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { AdminSearchableFields } from './admin.constant';
import { AdminModel } from './admin.model';
import { IAdmin } from './admin.interface';
import { AppError } from '../../errors/AppError';
import { HttpStatus } from 'http-status-ts';
import { UserModel } from '../user/user.model';

const getAllAdminsDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(AdminModel.find().populate('user'), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await adminQuery.countTotal();
  const result = await adminQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const getSingleAdminDB = async (id: string) => {
  const result = await AdminModel.findById(id);
  return result;
};

const updateAdminDB = async (id: string, payload: Partial<IAdmin>) => {
  const { name, ...remainingAdminData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdminData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await AdminModel.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteAdminDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedAdmin = await AdminModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedAdmin) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    // get user _id from deletedAdmin
    const userId = deletedAdmin.user;

    const deletedUser = await UserModel.findOneAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

// Block a user from the database
const blockUserHandleFromDB = async (userId: string) => {
  const user = await UserModel.findByIdAndUpdate(
    {
      _id: userId,
      role: 'user',
    },
    { isBlocked: true },
    { new: true },
  );

  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

export const AdminServices = {
  getAllAdminsDB,
  getSingleAdminDB,
  updateAdminDB,
  deleteAdminDB,
  blockUserHandleFromDB,
};
