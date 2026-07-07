import { QueryResultRow } from 'pg';
import { pg } from './connectToPostgres';
import { CustomError } from '../errors/handleError';

export const queryToPostgres = async <T, R extends QueryResultRow = T & QueryResultRow>(
  query: string,
  values?: Array<T[keyof T]>
): Promise<R[]> => {
  try {
    const { rows: data } = await pg.query<R>(query, values);
    return data;
  } catch (error) {
    if (error instanceof CustomError || error instanceof Error) throw new CustomError(error.message, 'PG QUERY', 500);
    throw new CustomError('Oops... something went wrong!', 'PG QUERY', 500);
  }
};
