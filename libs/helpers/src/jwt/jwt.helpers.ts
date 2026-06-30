import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@zayad/utils';
import { CustomError } from '../errors/handleError';

export const verifyJwt = (tokenFromClient: string) => {
  if (!JWT_SECRET) throw new CustomError('No Secret Key Was provided!', 'AUTH', 500);
  return verify(tokenFromClient, JWT_SECRET);
};
