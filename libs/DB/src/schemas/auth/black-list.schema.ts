import { ORM } from '../../orm/models/ORM';
import { AUTH_TABLES } from '../models/tables.models';

export const BLACK_LIST_SCHEMA = ORM.createSchema(AUTH_TABLES.BLACK_LIST, {
  id: ORM.uuid().primaryKey(),
  created_at: ORM.bigint().notNull(),
  update_at: ORM.bigint().notNull(),
  is_deleted: ORM.boolean().default('false'),
  name: ORM.varchar(55),
  user_id: ORM.varchar(55).unique(),
  attack_type: ORM.varchar(55),
  attack_details: ORM.varchar(255),
});
