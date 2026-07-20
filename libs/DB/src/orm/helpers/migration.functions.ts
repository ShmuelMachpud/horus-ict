import { Column } from '../models/Column';
import { SafeAction, ColumnCheck, UnsafeAction, SqlValue } from '../types/orm.types';

const REGEX_DEFAULT = /::[\w\s"]+$/;

export const parseTableName = (tableName: string): { schema: string; table: string } => {
  const [first, second] = tableName.split('.');
  return second ? { schema: first, table: second } : { schema: 'public', table: first };
};

const fullTableName = (tableName: string): string => {
  const { schema, table } = parseTableName(tableName);
  return `${schema}.${table}`;
};
export const normalizeType = (dataType: string, maxLength: number | null): string => {
  if (dataType === 'character varying') return maxLength ? `VARCHAR(${maxLength})` : 'VARCHAR';
  return dataType.toUpperCase();
};

export const normalizeDefault = (columnDefault: string): string => columnDefault.replace(REGEX_DEFAULT, '');

export const checkNewColumn = (column: Column<SqlValue>, tableName: string, columnName: string) => {
  const safe: SafeAction[] = [];
  const unsafe: UnsafeAction[] = [];
  if (column.config.defaultValue || !column.config.notNull)
    safe.push({
      description: `add column "${columnName}"`,
      sql: `ALTER TABLE ${tableName} ADD COLUMN ${column.toSQL(columnName)}`,
    });
  else {
    safe.push({
      description: `add column "${columnName}" as nullable (NOT NULL without default)`,
      sql: `ALTER TABLE ${tableName} ADD COLUMN "${columnName}" ${column.config.sqlType}`,
    });
    unsafe.push({
      description: `column "${columnName}" is NOT NULL in schema — backfill values first, then enforce`,
      manualSql: `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" SET NOT NULL;`,
    });
  }
  return { safe, unsafe };
};

const checkType: ColumnCheck = ({ tableName, columnName, column, dbColumn }) => {
  const unsafe: UnsafeAction[] = [];
  if (column.sqlType !== dbColumn.sqlType)
    unsafe.push({
      description: `column "${columnName}": schema says ${column.sqlType}, DB has ${dbColumn.sqlType}`,
      manualSql: `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" TYPE ${column.sqlType};`,
    });
  return { safe: [], unsafe };
};

const checkDefault: ColumnCheck = ({ tableName, columnName, column, dbColumn }) => {
  const safe: SafeAction[] = [];
  if (column.defaultValue?.toLowerCase() !== dbColumn.defaultValue?.toLowerCase())
    safe.push({
      description: `${column.defaultValue ? 'set' : 'drop'} default for "${columnName}"`,
      sql: column.defaultValue
        ? `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" SET DEFAULT ${column.defaultValue}`
        : `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" DROP DEFAULT`,
    });
  return { safe, unsafe: [] };
};

const checkNotNull: ColumnCheck = ({ tableName, columnName, column, dbColumn }) => {
  const safe: SafeAction[] = [];
  const unsafe: UnsafeAction[] = [];
  if (column.notNull !== dbColumn.notNull) {
    if (column.notNull)
      unsafe.push({
        description: `column "${columnName}" should be NOT NULL but DB allows nulls`,
        manualSql: `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" SET NOT NULL;`,
      });
    else
      safe.push({
        description: `drop NOT NULL for "${columnName}"`,
        sql: `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" DROP NOT NULL`,
      });
  }
  return { safe, unsafe };
};

const checkUnique: ColumnCheck = ({ tableName, table, columnName, column, dbColumn }) => {
  const safe: SafeAction[] = [];
  const unsafe: UnsafeAction[] = [];

  if (!column.primaryKey && column.unique !== dbColumn.unique) {
    const constraintName = `${table}_${columnName}_key`;
    if (column.unique)
      safe.push({
        description: `add unique constraint for "${columnName}"`,
        sql: `ALTER TABLE ${tableName} ADD CONSTRAINT "${constraintName}" UNIQUE ("${columnName}")`,
      });
    else
      unsafe.push({
        description: `column "${columnName}" is UNIQUE in DB but not in schema`,
        manualSql: `ALTER TABLE ${tableName} DROP CONSTRAINT "${constraintName}";`,
      });
  }

  return { safe, unsafe };
};

const checkPrimaryKey: ColumnCheck = ({ columnName, column, dbColumn }) => {
  const unsafe: UnsafeAction[] = [];
  if (column.primaryKey !== dbColumn.primaryKey)
    unsafe.push({
      description: `primary key mismatch on "${columnName}" — changing a PK is a manual operation`,
    });

  return { safe: [], unsafe };
};

const checkReference: ColumnCheck = ({ tableName, table, columnName, column, dbColumn }) => {
  const unsafe: UnsafeAction[] = [];
  const columnRef = column.reference;
  const dbRef = dbColumn.reference;
  const refChanged =
    (columnRef && !dbRef) ||
    (!columnRef && dbRef) ||
    (columnRef &&
      dbRef &&
      (fullTableName(columnRef.table) !== fullTableName(dbRef.table) || columnRef.column !== dbRef.column));
  if (refChanged)
    unsafe.push({
      description: `foreign key mismatch on "${columnName}"`,
      manualSql: columnRef
        ? `ALTER TABLE ${tableName} ADD CONSTRAINT "${table}_${columnName}_fkey" FOREIGN KEY ("${columnName}") REFERENCES ${fullTableName(columnRef.table)}("${columnRef.column}");`
        : `ALTER TABLE ${tableName} DROP CONSTRAINT "${table}_${columnName}_fkey";`,
    });

  return { safe: [], unsafe };
};

export const COLUMN_CHECKS: ColumnCheck[] = [
  checkType,
  checkDefault,
  checkNotNull,
  checkUnique,
  checkPrimaryKey,
  checkReference,
];
