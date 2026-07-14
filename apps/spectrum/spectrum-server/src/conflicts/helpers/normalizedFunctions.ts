import { AuthDataType } from '@zayad/types';
import { CreateConflictForDBType, CreateOrUpdateConflictType, UpdateConflictForDBType } from '../types/conflicts.types';

export const normalizedCreateForDB = (data: CreateOrUpdateConflictType, { user_id, unit_id }: AuthDataType) => {
  const newDate: CreateConflictForDBType = {
    unit_id,
    created_by: user_id,
    update_by: user_id,
    conflict: data.conflict,
    effect: data.effect,
    created_at: Date.now(),
    update_at: Date.now(),
  };
  return newDate;
};

export const normalizedUpdateForDB = (data: CreateOrUpdateConflictType, { user_id }: AuthDataType) => {
  const newDate: UpdateConflictForDBType = {
    update_by: user_id,
    conflict: data.conflict,
    effect: data.effect,
    update_at: Date.now(),
  };
  return newDate;
};
