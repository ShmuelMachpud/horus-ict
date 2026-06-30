import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TagsLoggerType } from '@zayad/types';
import { JsonWebTokenError } from 'jsonwebtoken';
import { normalizeErrorMessage } from './normalizeErrorMessage';

export class CustomError {
  status: StatusCodes;
  tag: TagsLoggerType;
  message: string;
  name: string;
  constructor(message: string, tag: TagsLoggerType, status: StatusCodes = 400, name?: string) {
    this.tag = tag;
    this.status = status;
    this.message = message;
    this.name = name ?? message;
  }
}

export const handleError = (
  res: Response,
  error: CustomError | Error | any,
  status: StatusCodes = 400,
  tag: TagsLoggerType = 'HTTP'
) => {
  if (error instanceof JsonWebTokenError) {
    global.log.error({ tag: 'TOKEN' }, `${error.message}`);
    if (error.message.includes('jwt expired')) {
      res.clearCookie('token');
      return res.status(401).send('Token Expired!');
    }
    return res.status(401).send('No Token');
  }
  if (error instanceof CustomError) {
    global.log.error({ tag: error.tag }, error.message);
    const sensitizedErrorMessage = normalizeErrorMessage(error);
    return res.status(error.status).send(sensitizedErrorMessage);
  } else {
    global.log.error({ tag }, error.message);
    return res.status(status).send('אופסס.. התרחשה שגיאה בשרת');
  }
};
