import { HttpStatus } from 'http-status-ts';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { IUser, TUserRole } from '../modules/user/user.interface';
import { UserModel } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // checking if the token is missing
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        HttpStatus.UNAUTHORIZED,
        'No authorization token provided',
      );
    }

    const token = authHeader.split(' ')[1];

    // checking if the token is missing
    if (!token) {
      throw new AppError(HttpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // checking if the token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as IUser;
    if (!decoded) {
      throw new AppError(HttpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    const { email, role, iat } = decoded as JwtPayload;

    // check if the user is exists
    const user = await UserModel.isUserExistsByEmail(email);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, 'User not found !');
    }

    // checking if the user is blocked

    if (user.isBlocked) {
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

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        HttpStatus.FORBIDDEN,
        'You are not allowed to access this resource!',
      );
    }

    req.user = user;
    next();
  });
};

export default auth;
