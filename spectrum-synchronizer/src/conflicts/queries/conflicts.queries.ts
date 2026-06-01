import { SCHEMAS } from "../../models/schemas.models";
import { TABLES_SPECTRUM } from "../../models/tables.models";
import { CreateConflictInterface } from "../types/conflicts.types";

export const insertConflictQuery = (data: CreateConflictInterface[]) => {
  const columns = Object.keys(data[0]);
  const values = data.flatMap((item) => columns.map((col) => item[col]));
  const setValues = data
    .map(
      (_, index) =>
        `(${columns
          .map((_, i) => `$${index * columns.length + i + 1}`)
          .join(", ")})`,
    )
    .join(", ");
  const query = `INSERT INTO ${SCHEMAS.SPECTRUM}.${TABLES_SPECTRUM.CONFLICTS} (
  ${columns.join(", ")}
) VALUES ${setValues} RETURNING *;`;
  return { query, values };
};
