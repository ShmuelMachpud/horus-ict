"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncTables = void 0;
const conflicts_service_1 = require("../../conflicts/services/conflicts.service");
const handleError_1 = require("../../utils/handleError");
const syncTables = async () => {
    try {
        await (0, conflicts_service_1.syncConflictsService)();
    }
    catch (error) {
        (0, handleError_1.handleError)(error, "Failed to sync tables", "SYNC TABLES");
    }
    finally {
        global.log.info({ tag: "SYNC TABLES" }, "End sync tables");
    }
};
exports.syncTables = syncTables;
