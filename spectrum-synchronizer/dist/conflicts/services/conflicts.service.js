"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncConflictsService = void 0;
const conflcts_dal_1 = require("../dal/conflcts.dal");
const conflict_mock_1 = require("../helpers/conflict.mock");
const syncConflictsService = async () => {
    try {
        const savedConflicts = await (0, conflcts_dal_1.syncConflictsDal)(conflict_mock_1.mockConflicts);
        return savedConflicts;
    }
    catch (error) {
        return Promise.reject(error);
    }
};
exports.syncConflictsService = syncConflictsService;
