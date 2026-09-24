import { randomUUID } from 'crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  configuredSchema,
  createBaseline,
  quote,
  schemaSignature,
} from '../baseline/schema-tools';
import { IndependentMedia1789674000000 } from './1789674000000-IndependentMedia';

export class InitialMuseum1789600000000 implements MigrationInterface {
  async up(runner: QueryRunner): Promise<void> {
    const schema = configuredSchema(runner);
    const tables = await runner.query(
      `SELECT tablename FROM pg_tables WHERE schemaname=$1 AND tablename<>'migrations'`,
      [schema],
    );
    if (!tables.length) {
      await createBaseline(runner, schema);
      return;
    }
    // Banco existente: validar antes de adotar; nunca pular CREATEs silenciosamente.
    const reference = `museum_baseline_${randomUUID().replaceAll('-', '')}`;
    await runner.query(`CREATE SCHEMA ${quote(reference)}`);
    try {
      await createBaseline(runner, reference);
      const actual = await schemaSignature(runner, schema);
      let expected = await schemaSignature(runner, reference);
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        // O DDL entregue já contém a migration de mídias.
        // A mesma migration é executada somente no schema de referência.
        const originalSchema = (
          runner.connection.options as { schema?: string }
        ).schema;
        try {
          (runner.connection.options as { schema?: string }).schema = reference;
          await new IndependentMedia1789674000000().up(runner);
        } finally {
          (runner.connection.options as { schema?: string }).schema =
            originalSchema;
        }
        expected = await schemaSignature(runner, reference);
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          const missing = expected.filter((item) => !actual.includes(item));
          const extra = actual.filter((item) => !expected.includes(item));
          throw new Error(
            `Baseline recusada: banco diverge do DDL. Ausente/diferente: ${missing.join('; ')}. Extra/diferente: ${extra.join('; ')}`,
          );
        }
        const history = await runner.query(
          `SELECT name FROM ${quote(schema)}.migrations WHERE name=$1`,
          ['IndependentMedia1789674000000'],
        );
        if (!history.length) {
          throw new Error(
            'Estrutura de mídias já atualizada, mas IndependentMedia não consta no histórico. Restaure o histórico de migrations correspondente antes de adotar a baseline.',
          );
        }
      }
    } finally {
      // Nome aleatório criado acima; nunca recebe o schema configurado pelo usuário.
      await runner.query(`DROP SCHEMA ${quote(reference)} CASCADE`);
    }
  }

  async down(): Promise<void> {
    throw new Error(
      'A baseline não remove tabelas ou dados. Para desfazer sua adoção, restaure o backup anterior.',
    );
  }
}
