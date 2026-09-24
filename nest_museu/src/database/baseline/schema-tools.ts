import { readFileSync } from 'fs';
import { join } from 'path';
import { QueryRunner } from 'typeorm';

export const quote = (name: string) => `"${name.replaceAll('"', '""')}"`;
export function configuredSchema(runner: QueryRunner): string {
  const schema = (runner.connection.options as { schema?: string }).schema;
  if (!schema)
    throw new Error('DB_SCHEMA é obrigatório para executar migrations.');
  if (!/^[A-Za-z_][A-Za-z0-9_]{0,62}$/.test(schema)) {
    throw new Error(
      'DB_SCHEMA deve ser um identificador simples com até 63 caracteres.',
    );
  }
  return schema;
}

export async function createBaseline(runner: QueryRunner, schema: string) {
  const sql = readFileSync(join(__dirname, 'initial-schema.sql'), 'utf8');
  await runner.query(sql.replaceAll('__SCHEMA__', quote(schema)));
}

/** Assinatura estrutural, sem ler dados pessoais e sem depender dos nomes das constraints. */
export async function schemaSignature(runner: QueryRunner, schema: string) {
  const normalize = (value: string | null) =>
    value == null
      ? null
      : value
          .replaceAll(`${quote(schema)}.`, '@schema.')
          .replaceAll(`${schema}.`, '@schema.');
  const columns = await runner.query(
    `
    SELECT c.relname AS table_name, a.attname AS column_name,
      format_type(a.atttypid,a.atttypmod) AS type, a.attnotnull AS not_null,
      pg_get_expr(d.adbin,d.adrelid) AS default_value
    FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    JOIN pg_attribute a ON a.attrelid=c.oid AND a.attnum>0 AND NOT a.attisdropped
    LEFT JOIN pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum
    WHERE n.nspname=$1 AND c.relkind='r' AND c.relname<>'migrations'
    ORDER BY c.relname,a.attname`,
    [schema],
  );
  const constraints = await runner.query(
    `
    SELECT t.relname AS table_name, c.contype AS kind, pg_get_constraintdef(c.oid) AS definition,
      rt.relname AS referenced_table, rn.nspname AS referenced_schema
    FROM pg_constraint c JOIN pg_class t ON t.oid=c.conrelid
    JOIN pg_namespace n ON n.oid=t.relnamespace
    LEFT JOIN pg_class rt ON rt.oid=c.confrelid
    LEFT JOIN pg_namespace rn ON rn.oid=rt.relnamespace
    WHERE n.nspname=$1 AND t.relname<>'migrations' AND c.contype IN ('p','u','f','c')`,
    [schema],
  );
  const indexes = await runner.query(
    `
    SELECT t.relname AS table_name, pg_get_indexdef(i.indexrelid) AS definition
    FROM pg_index i JOIN pg_class t ON t.oid=i.indrelid JOIN pg_namespace n ON n.oid=t.relnamespace
    WHERE n.nspname=$1 AND t.relname<>'migrations'
      AND NOT EXISTS(SELECT 1 FROM pg_constraint c WHERE c.conindid=i.indexrelid)`,
    [schema],
  );
  const enums = await runner.query(
    `
    SELECT t.typname AS name, array_agg(e.enumlabel ORDER BY e.enumsortorder) AS labels
    FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace JOIN pg_enum e ON e.enumtypid=t.oid
    WHERE n.nspname=$1 GROUP BY t.typname ORDER BY t.typname`,
    [schema],
  );
  return [
    ...columns.map(
      (r: any) =>
        `column ${r.table_name}.${r.column_name}: ${normalize(r.type)} | ${r.not_null} | ${normalize(r.default_value)}`,
    ),
    ...constraints.map((r: any) => {
      let definition = r.definition;
      if (r.kind === 'f') {
        const local =
          r.referenced_schema === schema ||
          (r.table_name === 'documents' &&
            r.referenced_schema === 'public' &&
            r.referenced_table === 'prints');
        definition = definition.replace(
          /REFERENCES\s+[^\s(]+/,
          `REFERENCES ${local ? '@schema' : r.referenced_schema}.${r.referenced_table}`,
        );
      }
      return `constraint ${r.table_name} ${r.kind}: ${normalize(definition)}`;
    }),
    ...indexes.map(
      (r: any) =>
        `index ${r.table_name}: ${normalize(r.definition)!.replace(/INDEX \S+ ON/, 'INDEX ON')}`,
    ),
    ...enums.map((r: any) => `enum ${r.name}: ${JSON.stringify(r.labels)}`),
  ].sort();
}
