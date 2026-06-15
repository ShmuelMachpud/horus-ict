import { InferTable } from '../../orm/types/orm.types';
import { ConflictsSchema } from '../queries/createTable.queries';

type ConflictInterface = InferTable<typeof ConflictsSchema>;
export interface CreateConflictInterface extends Omit<ConflictInterface, 'id' | 'is_deleted'> {}
