import { UUID } from 'crypto';
import { createConflictsDal, deleteConflictsDal, getConflictsDal, updateConflictsDal } from '../dal/conflicts.dal';
import { CustomError, validateFunction } from '@zayad/helpers';
import { CreateOrUpdateConflictType } from '../types/conflicts.types';
import { AuthDataType } from '@zayad/types';
import { normalizedCreateForDB, normalizedUpdateForDB } from '../helpers/normalizedFunctions';
import { createOrUpdateConflictsSchema } from '../helpers/conflicts.validations';

export const getConflictsService = async (unit_id: string, id?: UUID) => {
  try {
    const conflicts = await getConflictsDal(unit_id, id);
    if (!conflicts.length) throw new CustomError('No conflicts events were found', 'INSTANCE NOT FOUND', 404);
    if (id) return conflicts[0];
    return conflicts;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createConflictsService = async (data: CreateOrUpdateConflictType, userDetails: AuthDataType) => {
  try {
    validateFunction(createOrUpdateConflictsSchema, data);
    const normalizedData = normalizedCreateForDB(data, userDetails);
    const saved = await createConflictsDal(normalizedData);
    return saved;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateConflictsService = async (data: CreateOrUpdateConflictType, userDetails: AuthDataType, id: UUID) => {
  try {
    validateFunction(createOrUpdateConflictsSchema, data);
    const normalizedData = normalizedUpdateForDB(data, userDetails);
    const updateConflicts = await updateConflictsDal(normalizedData, id);
    return updateConflicts;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteConflictsService = async (unit_id: string, id?: UUID) => {
  try {
    const deleted = await deleteConflictsDal(unit_id, id);
    if (!deleted.length) throw new CustomError('No conflicts events were found', 'INSTANCE NOT FOUND', 404);
    if (id) return deleted[0];
    return deleted;
  } catch (error) {
    return Promise.reject(error);
  }
};
