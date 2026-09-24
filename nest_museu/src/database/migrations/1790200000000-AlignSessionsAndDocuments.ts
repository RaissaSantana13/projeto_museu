import { MigrationInterface, QueryRunner } from 'typeorm';
import { configuredSchema, quote } from '../baseline/schema-tools';

export class AlignSessionsAndDocuments1790200000000 implements MigrationInterface {
  async validate(runner: QueryRunner): Promise<void> {
    const schema = configuredSchema(runner);
    const s = quote(schema);
    const orphaned =
      await runner.query(`SELECT count(*)::int AS count FROM ${s}.documents d
      LEFT JOIN ${s}.prints p ON p.id_print=d.id_print WHERE d.id_print IS NOT NULL AND p.id_print IS NULL`);
    if (orphaned[0].count)
      throw new Error(
        'documents contém id_print sem correspondência em prints do museu. Resolva os vínculos antes de migrar; nenhum dado foi removido.',
      );
    const table = await runner.getTable(`${schema}.documents`);
    for (const fk of table!.foreignKeys.filter((key) =>
      key.columnNames.includes('id_print'),
    )) {
      if (fk.referencedSchema && fk.referencedSchema !== schema) {
        const [different] = await runner.query(`SELECT count(*)::int AS count
          FROM ${s}.documents d JOIN ${quote(fk.referencedSchema)}.prints old ON old.id_print=d.id_print
          JOIN ${s}.prints current ON current.id_print=d.id_print
          WHERE to_jsonb(old) IS DISTINCT FROM to_jsonb(current)`);
        if (different.count)
          throw new Error(
            'Os impressos referenciados fora do schema têm conteúdo diferente. Reconcilie os registros antes de alterar o vínculo.',
          );
      }
    }
  }

  async up(runner: QueryRunner): Promise<void> {
    await this.validate(runner);
    const schema = configuredSchema(runner);
    const s = quote(schema);
    await runner.query(`ALTER TABLE ${s}.session
      ALTER COLUMN token TYPE text,
      ADD COLUMN device jsonb,
      ADD COLUMN device_name varchar,
      ADD COLUMN is_valid boolean NOT NULL DEFAULT true,
      ADD COLUMN last_used_at timestamp`);
    const table = await runner.getTable(`${schema}.documents`);
    for (const fk of table!.foreignKeys.filter((fk) =>
      fk.columnNames.includes('id_print'),
    )) {
      await runner.dropForeignKey(`${schema}.documents`, fk);
    }
    await runner.query(`ALTER TABLE ${s}.documents ADD CONSTRAINT documents_id_print_fkey
      FOREIGN KEY (id_print) REFERENCES ${s}.prints(id_print) ON DELETE CASCADE`);
    // Perfis básicos versionados, sem alterar IDs ou vínculos existentes.
    for (const name of [
      'Super Administrador',
      'Administrador',
      'Curador',
      'Usuário',
      'Visitante',
    ]) {
      await runner.query(
        `INSERT INTO ${s}.roles (nome_role) SELECT $1::varchar(50)
        WHERE NOT EXISTS (SELECT 1 FROM ${s}.roles WHERE nome_role=$1::varchar(50))
        ON CONFLICT (nome_role) DO NOTHING`,
        [name],
      );
    }
  }

  async down(): Promise<void> {
    throw new Error(
      'Rollback bloqueado para preservar metadados de sessões e vínculos. Use uma migration corretiva ou restaure o backup.',
    );
  }
}
