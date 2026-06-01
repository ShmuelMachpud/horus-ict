import queryToPostgres from "../../helpers/postgres/query-to-postgres";
import { insertConflictQuery } from "../queries/conflicts.queries";
import { CreateConflictInterface } from "../types/conflicts.types";

export const syncConflictsDal = async (data: CreateConflictInterface[]) => {
  try {
    const { query, values } = insertConflictQuery(data);
    const savedConflicts = await queryToPostgres<CreateConflictInterface[]>(
      query,
      values,
    );
    return savedConflicts;
  } catch (error) {
    return Promise.reject(error);
  }
};
