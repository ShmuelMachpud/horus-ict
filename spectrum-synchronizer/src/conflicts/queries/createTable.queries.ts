import { SCHEMAS } from '../../models/schemas.models';
import { TABLES_SPECTRUM } from '../../models/tables.models';
import { Column } from '../../orm/models/Column';
import { Schema } from '../../orm/models/Schema';

const UnitsSchema = Schema.create('units', SCHEMAS.SPECTRUM, {
  id: Column.uuid().default('uuid_generate_v4()').primaryKey(),
  name: Column.varchar(255).notNull(),
});

export const ConflictsSchema = Schema.create(TABLES_SPECTRUM.CONFLICTS, SCHEMAS.SPECTRUM, {
  id: Column.uuid().default('uuid_generate_v4()').primaryKey(),
  created_at: Column.bigint().notNull(),
  updated_at: Column.bigint().notNull(),
  created_by: Column.varchar(255),
  updated_by: Column.varchar(255),
  is_deleted: Column.boolean().default('FALSE'),
  conflict: Column.varchar(255).notNull(),
  effect: Column.varchar(255).notNull(),
  unit_id: Column.uuid().reference(UnitsSchema.id).notNull(),
});
