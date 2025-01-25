import { HttpStatus } from 'http-status-ts';
import { UserModel } from '../user/user.model';
import { ILoginUser, IUserRegister } from './auth.interface';
import { AppError } from '../../errors/AppError';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './auth.utils';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';

// Register a new user in the database
const registerUser = async (payload: IUserRegister) => {
  // Check if the email is already taken
  if (await UserModel.isEmailTaken(payload.email)) {
    throw new AppError(HttpStatus.BAD_REQUEST, 'Email is already taken');
  }

  const user = await UserModel.create(payload);
  return user;
};

const loginUser = async (payload: ILoginUser) => {
  const user = await UserModel.isUserExistsByEmail(payload.email);

  // Check if the user exists
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the user is blocked
  if (user.isBlocked) {
    throw new AppError(HttpStatus.FORBIDDEN, 'User is blocked');
  }

  // Check if the password is matched
  const isPasswordMatched = await UserModel.isPasswordMatched(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  // access token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  // refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: {
    oldPassword: string;
    newPassword: string;
  },
) => {
  // check if the user is exists
  const user = await UserModel.isUserExistsByCustomId(userData.userId);
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, 'User not found !');
  }

  // check if the user is deleted
  const isDeletdUser = user?.isDeleted;
  if (isDeletdUser) {
    throw new AppError(HttpStatus.NOT_FOUND, 'User is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(HttpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  // checking if the password is correct
  if (
    !(await UserModel.isPasswordMatched(payload?.oldPassword, user?.password))
  )
    throw new AppError(HttpStatus.FORBIDDEN, 'Password is incorrect !');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bycrpt_salt),
  );

  await UserModel.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the token is missing
  if (!token) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  // checking if the token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userId, iat } = decoded as JwtPayload;

  // check if the user is exists
  const user = await UserModel.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, 'User not found !');
  }

  // check if the user is deleted
  const isDeletdUser = user?.isDeleted;
  if (isDeletdUser) {
    throw new AppError(HttpStatus.NOT_FOUND, 'User is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(HttpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  if (
    user.passwordChangedAt &&
    UserModel.isJWTIssuedBeforePasswordChanged(
      user.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    userId: user.id.toString(),
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userId: string) => {
  // check if the user is exists
  const user = await UserModel.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, 'User not found !');
  }

  // check if the user is deleted
  const isDeletdUser = user?.isDeleted;
  if (isDeletdUser) {
    throw new AppError(HttpStatus.NOT_FOUND, 'User is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(HttpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  // access token
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetLink = `${config.reset_paasword_url_link}?id=${user.id}&token=${resetToken}`;

  sendEmail(user.email, resetLink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  // check if the user is exists
  const user = await UserModel.isUserExistsByCustomId(payload?.id);
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, 'User not found !');
  }

  // check if the user is deleted
  const isDeletdUser = user?.isDeleted;
  if (isDeletdUser) {
    throw new AppError(HttpStatus.NOT_FOUND, 'User is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(HttpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  if (decoded.userId !== payload.id) {
    throw new AppError(HttpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bycrpt_salt),
  );

  await UserModel.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};

export const AuthServices = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
