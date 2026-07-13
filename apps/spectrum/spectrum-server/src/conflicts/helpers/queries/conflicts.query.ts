import { UUID } from 'crypto';

export const selectConflictsQuery = (unit_id: string, id?: UUID) => {
  let query = 'SELECT * FROM spectrum.conflicts\n';
  query += `WHERE unit_id = '${unit_id}'\n`;
  if (id) query += `AND id = '${id}'`;

  return query;
};
