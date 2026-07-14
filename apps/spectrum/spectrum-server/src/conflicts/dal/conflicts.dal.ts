import { UUID } from 'crypto';
import { CONFLICT_SCHEMA } from '@zayad/DB';
import { ConflictInterface, CreateConflictForDBType, UpdateConflictForDBType } from '../types/conflicts.types';
import { deleteConflictsQuery, insertConflictsQuery, updateConflictsQuery } from '../helpers/queries/conflicts.query';
import { queryToPostgres } from '@zayad/helpers';

export const getConflictsDal = async (unit_id: string, id?: UUID) => {
  try {
    const conflicts = await CONFLICT_SCHEMA.find({ where: { unit_id, id } });
    console.log(conflicts);

    return conflicts;
  } catch (error) {
    return Promise.reject(error);
  }
};
export const createConflictsDal = async (data: CreateConflictForDBType) => {
  try {
    const { query, values } = insertConflictsQuery(data);
    const insertConflict = await queryToPostgres<CreateConflictForDBType>(query, values);
    return insertConflict;
  } catch (error) {
    return Promise.reject(error);
  }
};
export const updateConflictsDal = async (data: UpdateConflictForDBType, id: UUID) => {
  try {
    const { query, values } = updateConflictsQuery(data, id);
    const updateConflict = queryToPostgres<UpdateConflictForDBType>(query, values);

    return updateConflict;
  } catch (error) {
    return Promise.reject(error);
  }
};
export const deleteConflictsDal = async (unit_id: string, id?: UUID) => {
  try {
    const query = deleteConflictsQuery(unit_id, id);
    const deleteConflict = await queryToPostgres<ConflictInterface>(query);

    return deleteConflict;
  } catch (error) {
    return Promise.reject(error);
  }
};
