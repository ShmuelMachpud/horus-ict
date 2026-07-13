import { ORM } from '../../orm/models/ORM';

export const UNIT_TREE_SCHEMA = ORM.createSchema('spectrum.units', {
  id: ORM.varchar(55).primaryKey(),
  unit_id: ORM.varchar(55).unique(),
  zayad_id: ORM.integer(),
  name: ORM.varchar(55).notNull(),
  type_id: ORM.varchar(55).notNull(), //enum
  type_name: ORM.varchar(55).notNull(), //enum
  is_deleted: ORM.boolean().default('false'),
  updated_at: ORM.bigint().notNull(),
  eged: ORM.varchar(55),
  brigade: ORM.varchar(55),
  division: ORM.varchar(55),
  corps: ORM.varchar(55),
  command: ORM.varchar(55),
  parent_id: ORM.varchar(55).notNull(),
  reality_id: ORM.varchar(55).unique(), // FK reality table
});
