import { Schema, column } from '../../orm';
import { SCHEMAS } from '../../models/schemas.models';
import { TABLES_SPECTRUM } from '../../models/tables.models';

const UnitsSchema = Schema.create('units', SCHEMAS.SPECTRUM, {
  id: column.uuid().default('uuid_generate_v4()').primaryKey(),
  name: column.varchar(255).notNull(),
});

export const ConflictsSchema = Schema.create(TABLES_SPECTRUM.CONFLICTS, SCHEMAS.SPECTRUM, {
  id: column.uuid().default('uuid_generate_v4()').primaryKey(),
  created_at: column.bigint().notNull(),
  updated_at: column.bigint().notNull(),
  created_by: column.varchar(255),
  updated_by: column.varchar(255),
  is_deleted: column.boolean().default('FALSE'),
  conflict: column.varchar(255).notNull(),
  effect: column.varchar(255).notNull(),
  unit_id: column.uuid().reference(UnitsSchema.id).notNull(),
});

