import { NextFunction, Request, Response } from 'express';

export const handleServerError = (error: Error, _: Request, res: Response, next: NextFunction) => {
  global.log.error({ tag: 'SERVER ERROR' }, error.message);
  res.status(500).send('שגיאה בשרת');
  next();
};
