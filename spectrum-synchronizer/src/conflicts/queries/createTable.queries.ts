import { Schema } from '../../orm';
import { SCHEMAS } from '../../models/schemas.models';
import { TABLES_SPECTRUM } from '../../models/tables.models';

export const ConflictsSchema = Schema.create(TABLES_SPECTRUM.CONFLICTS, SCHEMAS.SPECTRUM)
  .column('id').uuid().default('uuid_generate_v4()').primaryKey()
  .column('created_at').bigint().notNull()
  .column('updated_at').bigint().notNull()
  .column('created_by').varchar(255)
  .column('updated_by').varchar(255)
  .column('is_deleted').boolean().default('FALSE')
  .column('conflict').varchar(255).notNull()
  .column('effect').varchar(255).notNull();
