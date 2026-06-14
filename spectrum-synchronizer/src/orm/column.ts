import { ColumnDefinition } from './core/ColumnDefinition';

export const column = {
  uuid: () => new ColumnDefinition<string | null>('UUID'),
  varchar: (length: number) => new ColumnDefinition<string | null>(`VARCHAR(${length})`),
  integer: () => new ColumnDefinition<number | null>('INTEGER'),
  bigint: () => new ColumnDefinition<number | null>('BIGINT'),
  boolean: () => new ColumnDefinition<boolean | null>('BOOLEAN'),
};
