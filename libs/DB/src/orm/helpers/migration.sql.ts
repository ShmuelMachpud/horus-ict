export const COLUMNS_SQL = `
  SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
  FROM information_schema.columns
  WHERE table_schema = $1 AND table_name = $2`;

export const CONSTRAINTS_SQL = `
  SELECT tc.constraint_type, kcu.column_name,
         ccu.table_schema AS foreign_schema,
         ccu.table_name   AS foreign_table,
         ccu.column_name  AS foreign_column
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON kcu.constraint_name = tc.constraint_name
   AND kcu.table_schema    = tc.table_schema
  LEFT JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
   AND ccu.table_schema    = tc.table_schema
  WHERE tc.table_schema = $1 AND tc.table_name = $2
    AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE', 'FOREIGN KEY')`;
