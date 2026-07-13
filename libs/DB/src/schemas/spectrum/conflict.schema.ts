import { ORM } from '../../orm/models/ORM';
import { UNIT_TREE_SCHEMA } from '../auth/unit-tree.schema';
import { SPECTRUM_TABLES } from '../models/tables.models';

const { createSchema, uuid, bigint, varchar, boolean } = ORM;

export const CONFLICT_SCHEMA = createSchema(SPECTRUM_TABLES.CONFLICTS, {
  id: uuid().default('uuid_generate_v4()').primaryKey(),
  created_at: bigint().notNull(),
  updated_at: bigint().notNull(),
  created_by: varchar(255),
  updated_by: varchar(255),
  is_deleted: boolean().default('FALSE'),
  conflict: varchar(255).notNull(),
  effect: varchar(255).notNull(),
  unit_id: uuid().reference(UNIT_TREE_SCHEMA.id).notNull(),
});
