import { CreateConflictInterface } from "../types/conflicts.types";

export const mockConflicts: CreateConflictInterface[] = [
  {
    updated_at: Date.now(),
    created_at: Date.now(),
    created_by: "user1",
    updated_by: "user1",
    conflict: "conflict1",
    effect: "effect1",
  },
  {
    updated_at: Date.now(),
    created_at: Date.now(),
    created_by: "user2",
    updated_by: "user2",
    conflict: "conflict2",
    effect: "effect2",
  },
  {
    updated_at: Date.now(),
    created_at: Date.now(),
    created_by: "user3",
    updated_by: "user3",
    conflict: "conflict3",
    effect: "effect3",
  },
];
