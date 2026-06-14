import type { ColumnDefinition } from '../core/ColumnDefinition';
import type { ColumnRecord } from './orm.types';

export type InferRow<TCols extends ColumnRecord> = {
  [K in keyof TCols]: TCols[K] extends ColumnDefinition<infer T> ? T : never;
};

export type FindOptions<TCols extends ColumnRecord, TKeys extends keyof TCols & string = keyof TCols & string> = {
  select: TKeys[];
};