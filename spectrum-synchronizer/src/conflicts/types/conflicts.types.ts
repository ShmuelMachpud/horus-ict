export interface ConflictInterface {
  id: string; // uuid;
  created_at: number;
  updated_at: number;
  created_by: string | null;
  updated_by: string | null;
  is_deleted: boolean;
  conflict: string;
  effect: string;
}
export interface CreateConflictInterface extends Omit<ConflictInterface, "id" | "is_deleted"> {}
