"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFLICT_SCHEMA = exports.UnitsSchema = void 0;
const tables_models_1 = require("../../models/tables.models");
const ORM_1 = require("../../orm/models/ORM");
exports.UnitsSchema = ORM_1.ORM.createSchema('spectrum.units', {
    id: ORM_1.ORM.uuid().default('uuid_generate_v4()').primaryKey(),
    name: ORM_1.ORM.varchar(255).notNull(),
});
exports.CONFLICT_SCHEMA = ORM_1.ORM.createSchema(tables_models_1.SPECTRUM_TABLES.CONFLICTS, {
    id: ORM_1.ORM.uuid().default('uuid_generate_v4()').primaryKey(),
    created_at: ORM_1.ORM.bigint().notNull(),
    updated_at: ORM_1.ORM.bigint().notNull(),
    created_by: ORM_1.ORM.varchar(255),
    updated_by: ORM_1.ORM.varchar(255),
    is_deleted: ORM_1.ORM.boolean().default('FALSE'),
    conflict: ORM_1.ORM.varchar(255).notNull(),
    effect: ORM_1.ORM.varchar(255).notNull(),
    unit_id: ORM_1.ORM.uuid().reference(exports.UnitsSchema.id).notNull(),
});
