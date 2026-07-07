import { RequestWithUser } from '@zayad/types';
import { NextFunction, Response } from 'express';
import { CustomError, handleError } from '../../../helpers/dist/errors/handleError';
import { DANGEROUS_KEY_WORDS } from './dangerousKeyWords';

export const sqlInjection = (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const originalUrlAsArray = req.originalUrl.split('%20');
    const isDanger = originalUrlAsArray.some((word) => DANGEROUS_KEY_WORDS.includes(word.toLocaleUpperCase()));
    if (isDanger) {
      global.log.error({ message: 'SQL INJECTION' }, 'SQL Injection detected');
      throw new CustomError('SQL Injection detected', 'SQL_INJECTION', 403);
    }
    return next();
  } catch (error) {
    handleError(res, error);
  }
};
