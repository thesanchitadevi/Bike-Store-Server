/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatus } from 'http-status-ts';
import config from '../../config';
import { IUser } from './user.interface';
import { UserModel } from './user.model';

import mongoose from 'mongoose';
import { AppError } from '../../errors/AppError';
import { AdminModel } from '../admin/admin.model';
import { IAdmin } from '../admin/admin.interface';
import { generateAdminId } from './user.utils';

// Create admin in database
const createAdminDB = async (password: string, payload: IAdmin) => {
  // create a user object
  const userData: Partial<IUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'admin';
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    // create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await AdminModel.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

// Create getMe function
const getMe = async (userId: string, role: string) => {
  let result = null;
  if (role === 'cutomer') {
    result = await UserModel.findOne({ id: userId }).populate('user');
  }
  if (role === 'admin') {
    result = await AdminModel.findOne({ id: userId }).populate('user');
  }

  return result;
};

// Change status function
const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await UserModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  createAdminDB,
  getMe,
  changeStatus,
};
