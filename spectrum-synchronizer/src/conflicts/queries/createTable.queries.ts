import { SPECTRUM_TABLES } from '../../models/tables.models';
import { ORM } from '../../orm/models/ORM';

export const UnitsSchema = ORM.createSchema('spectrum.units', {
  id: ORM.uuid().default('uuid_generate_v4()').primaryKey(),
  name: ORM.varchar(255).notNull(),
});

export const CONFLICT_SCHEMA = ORM.createSchema(SPECTRUM_TABLES.CONFLICTS, {
  id: ORM.uuid().default('uuid_generate_v4()').primaryKey(),
  created_at: ORM.bigint().notNull(),
  updated_at: ORM.bigint().notNull(),
  created_by: ORM.varchar(255),
  updated_by: ORM.varchar(255),
  is_deleted: ORM.boolean().default('FALSE'),
  conflict: ORM.varchar(255).notNull(),
  effect: ORM.varchar(255).notNull(),
  unit_id: ORM.uuid().reference(UnitsSchema.id).notNull(),
});
