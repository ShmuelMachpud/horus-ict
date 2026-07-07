import { CustomError, handleError, tokenSchema, validateFunction, verifyJwt } from '@zayad/helpers';
import { AuthDataType, RequestWithUser } from '@zayad/types';
import { NextFunction, Response } from 'express';

export const auth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.token;
    if (!token) throw new CustomError('No TOKEN!', 'TOKEN', 401);
    if (typeof token !== 'string') throw new CustomError('No TOKEN!', 'TOKEN', 401);

    const userInfo = verifyJwt(token) as AuthDataType;
    validateFunction(tokenSchema, userInfo);

    const { exp } = userInfo;
    if (exp <= Date.now() / 1000) throw new CustomError('Token Expired!', 'TOKEN', 401);

    req.user = userInfo;
    return next();
  } catch (error) {
    handleError(res, error);
  }
};
