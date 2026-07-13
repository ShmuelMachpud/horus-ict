import { UUID } from 'crypto';
import { getConflictsDal } from '../dal/conflicts.dal';
import { CustomError } from '@zayad/helpers';

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
