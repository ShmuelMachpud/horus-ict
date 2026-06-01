import { syncConflictsDal } from "../dal/conflcts.dal";
import { mockConflicts } from "../helpers/conflict.mock";

export const syncConflictsService = async () => {
  try {
    const savedConflicts = await syncConflictsDal(mockConflicts);
    return savedConflicts;
  } catch (error) {
    return Promise.reject(error);
  }
};
