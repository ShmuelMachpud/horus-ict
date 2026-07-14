import Joi from 'joi';
import { CreateOrUpdateConflictType } from '../types/conflicts.types';

export const createOrUpdateConflictsSchema = Joi.object<CreateOrUpdateConflictType>({
  conflict: Joi.string().min(2).max(1024).required().messages({
    'any.required': 'שדה "קונפליקט" הוא שדה חובה',
    'string.base': 'שדה "קונפליקט" צריך להיות מסוג string',
    'string.empty': 'שדה "קונפליקט" אינו יכול להיות ריק',
    'string.min': 'שדה "קונפליקט" צריך להכיל מינימום 2 תווים',
    'string.max': 'שדה "קונפליקט" צריך להכיל מקסימום 1024 תווים',
  }),
  effect: Joi.string().min(2).max(1024).required().messages({
    'any.required': 'שדה "השפעה" הוא שדה חובה',
    'string.base': 'שדה "השפעה" צריך להיות מסוג string',
    'string.empty': 'שדה "השפעה" אינו יכול להיות ריק',
    'string.min': 'שדה "השפעה" צריך להכיל מינימום 2 תווים',
    'string.max': 'שדה "השפעה" צריך להכיל מקסימום 1024 תווים',
  }),
});
