import { InferTable } from '../../orm/types/orm.types';
import { CONFLICT_SCHEMA } from '../queries/createTable.queries';

type ConflictInterface = InferTable<typeof CONFLICT_SCHEMA>;
export interface CreateConflictInterface extends Omit<ConflictInterface, 'id' | 'is_deleted'> {}
