import Joi from 'joi';
import { AuthDataType } from '@zayad/types';

export const tokenSchema = Joi.object<AuthDataType>({
  reality_id: Joi.string().min(2).required().messages({
    'any.required': 'שדה "מזהה מציאות" הוא שדה חובה',
    'string.base': 'שדה "מזהה מציאות" הוא שדה חובה',
    'string.empty': 'שדה "מזהה מציאות" הוא שדה חובה',
  }),
  reality_name: Joi.string().min(2).required().messages({
    'any.required': 'שדה " מציאות" הוא שדה חובה',
    'string.base': 'שדה " מציאות" הוא שדה חובה',
    'string.empty': 'שדה " מציאות" הוא שדה חובה',
  }),
  unit_id: Joi.string().min(2).required().messages({
    'any.required': 'שדה "מזהה יחידה" הוא שדה חובה',
    'string.base': 'שדה "מזהה יחידה" הוא שדה חובה',
    'string.empty': 'שדה "מזהה יחידה" הוא שדה חובה',
  }),
  unit_name: Joi.string().min(2).required().messages({
    'any.required': 'שדה "יחידה " הוא שדה חובה',
    'string.base': 'שדה "יחידה " הוא שדה חובה',
    'string.empty': 'שדה "יחידה " הוא שדה חובה',
  }),
  cell_id: Joi.string().min(2).messages({
    'string.base': 'שדה "מזהה תא" הוא שדה חובה',
  }),
  cell_name: Joi.string().min(2).messages({
    'string.base': 'שדה "תא" הוא שדה חובה',
  }),
  unit_type: Joi.string().min(2).required().messages({
    'any.required': 'שדה "יחידה" הוא שדה חובה',
    'string.base': 'שדה "יחידה" הוא שדה חובה',
    'string.empty': 'שדה "יחידה" הוא שדה חובה',
  }),
  user_id: Joi.string().min(2).required().messages({
    'string.base': 'שדה "מזהה תא" הוא שדה חובה',
  }),
  upn: Joi.string().min(2).messages({
    'string.base': 'שדה "מזהה תא" הוא שדה חובה',
  }),
  role: Joi.string().min(2).messages({
    'string.base': 'שדה "role" הוא שדה חובה',
  }),
  exp: Joi.string().min(2).messages({
    'string.base': 'שדה "exp" הוא שדה חובה',
  }),
  iat: Joi.optional(),
});
