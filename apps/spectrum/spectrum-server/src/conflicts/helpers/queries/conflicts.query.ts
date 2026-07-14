import { UUID } from 'crypto';
import { CreateConflictForDBType, UpdateConflictForDBType } from '../../types/conflicts.types';
import { SCHEMAS, TABLES_SPECTRUM } from '@zayad/utils';

export const deleteConflictsQuery = (unit_id: string, id?: UUID) => {
  let query = `
    DELETE FROM ${SCHEMAS.SPECTRUM}.${TABLES_SPECTRUM.CONFLICTS}\n
    WHERE unit_id = '${unit_id}'
  `;
  if (id) query += ` AND id = '${id}'`;

  return query;
};

export const insertConflictsQuery = (data: CreateConflictForDBType) => {
  const columns = Object.keys(data);
  const values = Object.values(data) as (string | number | null)[];
  let query = `
  INSERT INTO ${SCHEMAS.SPECTRUM}.${TABLES_SPECTRUM.CONFLICTS}(${columns.join(', ')})\n
  VALUES ${columns.map((_, i) => `$${i + 1}`)}\n
  ON CONFLICTS DO NOTHING\n
  RETURNING *
  `;

  return { query, values };
};

export const updateConflictsQuery = (data: UpdateConflictForDBType, id: UUID) => {
  const fields = Object.keys(data);
  const values = Object.values(data) as (string | number | null)[];
  const set = fields.map((field, i) => `${field.toString()} = $${i + 1}`);
  let query = `
  UPDATE ${SCHEMAS.SPECTRUM}.${TABLES_SPECTRUM.CONFLICTS}\n
  SET ${set.join(', ')}\n
  WHERE id = '${id}'\n
  RETURNING *
  `;

  return { query, values };
};
