"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncConflictsDal = void 0;
const ORM_1 = require("../../orm/models/ORM");
const conflicts_queries_1 = require("../queries/conflicts.queries");
const syncConflictsDal = async (data) => {
    try {
        const { query, values } = (0, conflicts_queries_1.insertConflictQuery)(data);
        const savedConflicts = await ORM_1.ORM.query(query, values);
        return savedConflicts;
    }
    catch (error) {
        return Promise.reject(error);
    }
};
exports.syncConflictsDal = syncConflictsDal;
