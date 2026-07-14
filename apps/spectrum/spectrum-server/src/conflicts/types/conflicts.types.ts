import { UUID } from 'crypto';

export interface ConflictInterface {
  id: UUID;
  created_at: number;
  update_at: number;
  created_by: string | null;
  update_by: string | null;
  is_deleted: boolean;
  unit_id: string;
  conflict: string;
  effect: string;
}

export type CreateOrUpdateConflictType = Pick<ConflictInterface, 'conflict' | 'effect'>;

export type CreateConflictForDBType = Omit<ConflictInterface, 'id' | 'is_deleted'>;

export type UpdateConflictForDBType = Pick<ConflictInterface, 'conflict' | 'effect' | 'update_at' | 'update_by'>;
