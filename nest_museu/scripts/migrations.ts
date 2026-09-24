import dataSource from '../src/database/data.source';
import { quote, configuredSchema } from '../src/database/baseline/schema-tools';
import { InitialMuseum1789600000000 } from '../src/database/migrations/1789600000000-InitialMuseum';
import { AlignSessionsAndDocuments1790200000000 } from '../src/database/migrations/1790200000000-AlignSessionsAndDocuments';

async function main() {
  const command = process.argv[2];
  if (!['run', 'show', 'revert', 'check'].includes(command))
    throw new Error('Use run, show, check ou revert');
  // Operações de migration não precisam carregar entidades nem instalar extensões.
  dataSource.setOptions({ entities: [] });
  await dataSource.initialize();
  const runner = dataSource.createQueryRunner();
  try {
    const schema = configuredSchema(runner);
    if (command === 'show') {
      await runner.startTransaction();
      await runner.query('SET TRANSACTION READ ONLY');
      const [exists] = await runner.query('SELECT to_regclass($1) AS name', [
        `${quote(schema)}.migrations`,
      ]);
      const applied: { name: string }[] = exists.name
        ? await runner.query(
            `SELECT name FROM ${quote(schema)}.migrations ORDER BY timestamp`,
          )
        : [];
      for (const migration of dataSource.migrations) {
        console.log(
          `${applied.some((row) => row.name === migration.name || row.name === migration.constructor.name) ? '[X]' : '[ ]'} ${migration.name || migration.constructor.name}`,
        );
      }
      await runner.rollbackTransaction();
    } else {
      // check não grava histórico, perfis ou sessões, nem consome suas sequences.
      if (command === 'check') {
        await runner.startTransaction();
        try {
          await runner.query(`CREATE SCHEMA IF NOT EXISTS ${quote(schema)}`);
          const [exists] = await runner.query(
            'SELECT to_regclass($1) AS name',
            [`${quote(schema)}.migrations`],
          );
          const history: { name: string }[] = exists.name
            ? await runner.query(`SELECT name FROM ${quote(schema)}.migrations`)
            : [];
          if (
            !history.some((row) => row.name === 'InitialMuseum1789600000000')
          ) {
            await new InitialMuseum1789600000000().up(runner);
          }
          if (
            !history.some(
              (row) => row.name === 'AlignSessionsAndDocuments1790200000000',
            )
          ) {
            await new AlignSessionsAndDocuments1790200000000().validate(runner);
          }
          console.log(
            'Pré-validação concluída; nenhum dado ou histórico foi alterado.',
          );
        } finally {
          if (runner.isTransactionActive) await runner.rollbackTransaction();
        }
      } else if (command === 'run') {
        await runner.query(`CREATE SCHEMA IF NOT EXISTS ${quote(schema)}`);
        const executed = await dataSource.runMigrations({ transaction: 'all' });
        console.log(
          'Aplicadas:',
          executed.map((m) => m.name).join(', ') || 'nenhuma pendente',
        );
      } else {
        await dataSource.undoLastMigration({ transaction: 'all' });
      }
    }
  } finally {
    if (runner.isTransactionActive) await runner.rollbackTransaction();
    await runner.release();
    await dataSource.destroy();
  }
}
main().catch((error: Error) => {
  console.error(error.message);
  process.exitCode = 1;
});
