import { col, Schema } from '../../orm';
import { SCHEMAS } from '../../models/schemas.models';
import { TABLES_SPECTRUM } from '../../models/tables.models';

export const ConflictsSchema = Schema.create(TABLES_SPECTRUM.CONFLICTS, SCHEMAS.SPECTRUM)
  .column('id', col.uuid().default('uuid_generate_v4()').primaryKey())
  .column('created_at', col.bigint().notNull())
  .column('updated_at', col.bigint().notNull())
  .column('created_by', col.varchar(255))
  .column('updated_by', col.varchar(255))
  .column('is_deleted', col.boolean().default('FALSE'))
  .column('conflict', col.varchar(255).notNull())
  .column('effect', col.varchar(255).notNull());
