import { syncConflictsService } from "../../conflicts/services/conflicts.service";
import { handleError } from "../../utils/handleError";

export const syncTables = async () => {
  try {
    await syncConflictsService();
  } catch (error) {
    handleError(error, "Failed to sync tables", "SYNC TABLES");
  } finally {
    global.log.info({ tag: "SYNC TABLES" }, "End sync tables");
  }
};
