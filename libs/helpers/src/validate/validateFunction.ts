import { ObjectSchema } from 'joi';
import { CustomError } from '../errors/handleError';
import { hebrewCharsRegex } from '@zayad/utils';
import { changeDirToRtl } from './changeDirToRtl';

export const validateFunction = <T extends Object>(schema: ObjectSchema, data: T) => {
  const { error } = schema.validate(data);
  let errorMessage = error?.details[0].message;
  if (!errorMessage) return;
  const hebrewMatches = errorMessage.match(hebrewCharsRegex);
  if (hebrewMatches?.length) errorMessage = changeDirToRtl(errorMessage);
  if (error) throw new CustomError(errorMessage, 'VALIDATION ERROR', 400);
};
