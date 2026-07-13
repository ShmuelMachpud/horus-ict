import { UUID } from 'crypto';
import { selectConflictsQuery } from '../helpers/queries/conflicts.query';
import { queryToPostgres } from '@zayad/helpers';

export const getConflictsDal = async (unit_id: string, id?: UUID) => {
  try {
    const getAllConflictsQuery = selectConflictsQuery(unit_id, id);
    const conflicts = await queryToPostgres(getAllConflictsQuery);
    return conflicts;
  } catch (error) {
    return Promise.reject(error);
  }
};
