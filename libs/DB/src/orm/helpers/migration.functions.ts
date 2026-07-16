import { Column } from '../models/Column';
import { AlterAction, ColumnCheck, MigrationWarning, SqlValue } from '../types/orm.types';

const PG_TYPE_MAP: Record<string, string> = {
  uuid: 'UUID',
  integer: 'INTEGER',
  bigint: 'BIGINT',
  boolean: 'BOOLEAN',
};

export const normalizeType = (dataType: string, maxLength: number | null): string => {
  if (dataType === 'character varying') return maxLength ? `VARCHAR(${maxLength})` : 'VARCHAR';
  return PG_TYPE_MAP[dataType] ?? dataType.toUpperCase();
};

export const normalizeDefault = (columnDefault: string): string => columnDefault.replace(/::[\w\s"]+$/, '');

export const qualify = (table: string): string => (table.includes('.') ? table : `public.${table}`);

export const checkNewColumn = (column: Column<SqlValue>, tableName: string, columnName: string) => {
  const safe: AlterAction[] = [];
  const unSafe: MigrationWarning[] = [];
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
    unSafe.push({
      description: `column "${columnName}" is NOT NULL in schema — backfill values first, then enforce`,
      manualSql: `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" SET NOT NULL;`,
    });
  }
  return { safe, unSafe };
};

const checkType: ColumnCheck = ({ tableName, columnName, column, dbColumn }) => {
  const unSafe: MigrationWarning[] = [];
  if (column.sqlType !== dbColumn.sqlType)
    unSafe.push({
      description: `column "${columnName}": schema says ${column.sqlType}, DB has ${dbColumn.sqlType}`,
      manualSql: `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" TYPE ${column.sqlType};`,
    });
  return { safe: [], unSafe };
};

const checkDefault: ColumnCheck = ({ tableName, columnName, column, dbColumn }) => {
  const safe: AlterAction[] = [];
  if (column.defaultValue?.toLowerCase() !== dbColumn.defaultValue?.toLowerCase())
    safe.push({
      description: `${column.defaultValue ? 'set' : 'drop'} default for "${columnName}"`,
      sql: column.defaultValue
        ? `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" SET DEFAULT ${column.defaultValue}`
        : `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" DROP DEFAULT`,
    });
  return { safe, unSafe: [] };
};

const checkNotNull: ColumnCheck = ({ tableName, columnName, column, dbColumn }) => {
  const safe: AlterAction[] = [];
  const unSafe: MigrationWarning[] = [];
  if (column.notNull !== dbColumn.notNull) {
    if (column.notNull)
      unSafe.push({
        description: `column "${columnName}" should be NOT NULL but DB allows nulls`,
        manualSql: `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" SET NOT NULL;`,
      });
    else
      safe.push({
        description: `drop NOT NULL for "${columnName}"`,
        sql: `ALTER TABLE ${tableName} ALTER COLUMN "${columnName}" DROP NOT NULL`,
      });
  }
  return { safe, unSafe };
};

const checkUnique: ColumnCheck = ({ tableName, table, columnName, column, dbColumn }) => {
  const safe: AlterAction[] = [];
  const unSafe: MigrationWarning[] = [];

  if (!column.primaryKey && column.unique !== dbColumn.unique) {
    const constraintName = `${table}_${columnName}_key`;
    if (column.unique)
      safe.push({
        description: `add unique constraint for "${columnName}"`,
        sql: `ALTER TABLE ${tableName} ADD CONSTRAINT "${constraintName}" UNIQUE ("${columnName}")`,
      });
    else
      unSafe.push({
        description: `column "${columnName}" is UNIQUE in DB but not in schema`,
        manualSql: `ALTER TABLE ${tableName} DROP CONSTRAINT "${constraintName}";`,
      });
  }

  return { safe, unSafe };
};

const checkPrimaryKey: ColumnCheck = ({ tableName, columnName, column, dbColumn }) => {
  const unSafe: MigrationWarning[] = [];
  if (column.primaryKey !== dbColumn.primaryKey)
    unSafe.push({
      description: `primary key mismatch on "${columnName}" — changing a PK is a manual operation`,
      manualSql: `-- review manually: ALTER TABLE ${tableName} ... PRIMARY KEY`,
    });

  return { safe: [], unSafe };
};

const checkReference: ColumnCheck = ({ tableName, table, columnName, column, dbColumn }) => {
  const unSafe: MigrationWarning[] = [];
  const columnRef = column.reference;
  const dbRef = dbColumn.reference;
  const refChanged =
    (columnRef && !dbRef) ||
    (!columnRef && dbRef) ||
    (columnRef && dbRef && (qualify(columnRef.table) !== qualify(dbRef.table) || columnRef.column !== dbRef.column));
  if (refChanged)
    unSafe.push({
      description: `foreign key mismatch on "${columnName}"`,
      manualSql: columnRef
        ? `ALTER TABLE ${tableName} ADD CONSTRAINT "${table}_${columnName}_fkey" FOREIGN KEY ("${columnName}") REFERENCES ${qualify(columnRef.table)}("${columnRef.column}");`
        : `ALTER TABLE ${tableName} DROP CONSTRAINT "${table}_${columnName}_fkey";`,
    });

  return { safe: [], unSafe };
};

export const COLUMN_CHECKS: ColumnCheck[] = [
  checkType,
  checkDefault,
  checkNotNull,
  checkUnique,
  checkPrimaryKey,
  checkReference,
];
