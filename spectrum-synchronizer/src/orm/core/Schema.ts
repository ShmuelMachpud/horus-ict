import queryToPostgres from '../../helpers/postgres/query-to-postgres';
import type {
  ColumnRecord,
  InferRow,
  OnDeleteAction,
  OnUpdateAction,
  ReferenceDefinition,
  SqlValue,
} from '../types/orm.types';
import type { Column } from './Column';

export class Schema<TName extends string, TCols extends ColumnRecord> {
  readonly columns: TCols;

  private readonly _tableName: TName;
  private readonly _schemaName: string;
  private readonly _references: readonly ReferenceDefinition[];

  private constructor(
    tableName: TName,
    schemaName: string,
    columns: TCols,
    references: readonly ReferenceDefinition[],
  ) {
    this._tableName = tableName;
    this._schemaName = schemaName;
    this.columns = columns;
    this._references = references;
  }

  static create<TName extends string>(
    tableName: TName,
    schemaName = 'public',
  ): Schema<TName, Record<never, never>> {
    return new Schema(tableName, schemaName, {} as Record<never, never>, []);
  }

  column<TColName extends string, TCol extends Column<SqlValue>>(
    name: TColName,
    definition: TCol,
  ): Schema<TName, TCols & Record<TColName, TCol>> {
    return new Schema(
      this._tableName,
      this._schemaName,
      { ...this.columns, [name]: definition } as TCols & Record<TColName, TCol>,
      this._references,
    );
  }

  reference<
    TFromCol extends keyof TCols & string,
    TRefSchema extends Schema<string, ColumnRecord>,
    TToCol extends keyof TRefSchema['columns'] & string,
  >(
    fromColumn: TFromCol,
    toSchema: TRefSchema,
    toColumn: TToCol,
    options?: { onDelete?: OnDeleteAction; onUpdate?: OnUpdateAction },
  ): Schema<TName, TCols> {
    const ref: ReferenceDefinition = {
      fromColumn,
      toFullTable: `${toSchema._schemaName}.${toSchema._tableName}`,
      toColumn,
      ...options,
    };
    return new Schema(this._tableName, this._schemaName, this.columns, [
      ...this._references,
      ref,
    ]);
  }

  get tableName(): TName {
    return this._tableName;
  }

  get schemaName(): string {
    return this._schemaName;
  }

  get fullName(): string {
    return `${this._schemaName}.${this._tableName}`;
  }

  toSQL(): string {
    const colDefs = Object.entries(this.columns)
      .map(([name, col]) => `    ${col.toSQL(name)}`)
      .join(',\n');

    const refDefs = this._references.map(
      ({ fromColumn, toFullTable, toColumn, onDelete, onUpdate }) => {
        let fk = `    FOREIGN KEY ("${fromColumn}") REFERENCES ${toFullTable}("${toColumn}")`;
        if (onDelete) fk += ` ON DELETE ${onDelete}`;
        if (onUpdate) fk += ` ON UPDATE ${onUpdate}`;
        return fk;
      },
    );

    const allDefs =
      refDefs.length > 0 ? [colDefs, ...refDefs].join(',\n') : colDefs;

    return `CREATE TABLE IF NOT EXISTS ${this.fullName} (\n${allDefs}\n)`;
  }

  async sync(): Promise<void> {
    await queryToPostgres(`CREATE SCHEMA IF NOT EXISTS ${this._schemaName}`);
    await queryToPostgres(this.toSQL());
    global.log.success({ tag: 'ORM' }, `Synced table "${this.fullName}"`);
  }
}

export type InferSchemaRow<T extends Schema<string, ColumnRecord>> = InferRow<T['columns']>;
