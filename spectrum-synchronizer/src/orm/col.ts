import { Column } from "./core/Column";

export const col = {
  uuid: () => new Column<string | null>("UUID"),
  varchar: (length: number) => new Column<string | null>(`VARCHAR(${length})`),
  text: () => new Column<string | null>("TEXT"),
  integer: () => new Column<number | null>("INTEGER"),
  bigint: () => new Column<number | null>("BIGINT"),
  boolean: () => new Column<boolean | null>("BOOLEAN"),
  timestamp: () => new Column<Date | null>("TIMESTAMP WITH TIME ZONE"),
  serial: () => new Column<number>("SERIAL"),
  jsonb: () => new Column<object | null>("JSONB"),
};
