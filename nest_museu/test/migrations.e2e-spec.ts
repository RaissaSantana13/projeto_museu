import 'dotenv/config';
import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import { InitialMuseum1789600000000 } from '../src/database/migrations/1789600000000-InitialMuseum';
import { IndependentMedia1789674000000 } from '../src/database/migrations/1789674000000-IndependentMedia';
import { AlignSessionsAndDocuments1790200000000 } from '../src/database/migrations/1790200000000-AlignSessionsAndDocuments';
import {
  createBaseline,
  quote,
  schemaSignature,
} from '../src/database/baseline/schema-tools';
import { entityPaths } from '../src/database/entities';
import { Session } from '../src/module/auth/entities/session.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

jest.setTimeout(60000);
const migrations = [
  InitialMuseum1789600000000,
  IndependentMedia1789674000000,
  AlignSessionsAndDocuments1790200000000,
];
const connection = {
  type: 'postgres' as const,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  installExtensions: false,
  synchronize: false,
};
const sources: DataSource[] = [];

async function isolated(legacy = false, media = false) {
  const schema = `museum_mig_test_${randomUUID().replaceAll('-', '')}`;
  const source = await new DataSource({
    ...connection,
    schema,
    migrations,
  }).initialize();
  sources.push(source);
  await source.query(`CREATE SCHEMA ${quote(schema)}`);
  if (legacy) {
    const runner = source.createQueryRunner();
    try {
      await createBaseline(runner, schema);
      if (media) {
        await new IndependentMedia1789674000000().up(runner);
        await source.query(
          `CREATE TABLE ${quote(schema)}.migrations (id serial PRIMARY KEY, timestamp bigint NOT NULL, name varchar NOT NULL)`,
        );
        await source.query(
          `INSERT INTO ${quote(schema)}.migrations(timestamp,name) VALUES (1789674000000,'IndependentMedia1789674000000')`,
        );
      }
    } finally {
      await runner.release();
    }
  }
  return { source, s: quote(schema), schema };
}

afterAll(async () => {
  for (const source of sources) {
    const schema = (source.options as { schema: string }).schema;
    if (!/^museum_mig_test_[a-f0-9]{32}$/.test(schema))
      throw new Error('Schema de teste inválido');
    await source.query(`DROP SCHEMA ${quote(schema)} CASCADE`);
    await source.destroy();
  }
});

it('cria as 27 tabelas em banco vazio, aplica todas as migrations e não repete', async () => {
  const { source, schema, s } = await isolated();
  expect(await source.runMigrations()).toHaveLength(3);
  const tables = await source.query(
    'SELECT tablename FROM pg_tables WHERE schemaname=$1',
    [schema],
  );
  expect(tables).toHaveLength(28); // 27 de domínio + histórico
  expect(await source.query(`SELECT * FROM ${s}.roles`)).toHaveLength(5);
  expect(await source.runMigrations()).toHaveLength(0);
  const [fk] = await source.query(
    `SELECT pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE conrelid=$1::regclass AND conname='documents_id_print_fkey'`,
    [`${s}.documents`],
  );
  expect(fk.definition).toContain(`${schema}.prints`);
});

it('adota DDL existente com mídias já migradas sem perder usuários, senhas, vínculos ou sessões', async () => {
  const { source, s, schema } = await isolated(true, true);
  await source.query(
    `INSERT INTO ${s}."user" (firstname,lastname,username) VALUES ('Teste','Migration','migration-test')`,
  );
  await source.query(
    `INSERT INTO ${s}.credentials (id_user,email,password) VALUES (1,'migration@example.invalid','hash-preservado')`,
  );
  await source.query(`INSERT INTO ${s}.roles(nome_role) VALUES ('Curador')`);
  await source.query(`INSERT INTO ${s}.user_roles VALUES (1,1)`);
  await source.query(
    `INSERT INTO ${s}.session(id_user,token,expires_at) VALUES (1,'sessao-preservada',now()+interval '1 hour')`,
  );
  expect(await source.runMigrations()).toHaveLength(2);
  expect(
    (await source.query(`SELECT password FROM ${s}.credentials`))[0].password,
  ).toBe('hash-preservado');
  expect(
    (
      await source.query(
        `SELECT id_role FROM ${s}.roles WHERE nome_role='Curador'`,
      )
    )[0].id_role,
  ).toBe(1);
  expect(await source.query(`SELECT * FROM ${s}.user_roles`)).toEqual([
    { id_user: 1, id_role: 1 },
  ]);
  expect(
    (
      await source.query(`SELECT id_session,token,is_valid FROM ${s}.session`)
    )[0],
  ).toEqual({ id_session: 1, token: 'sessao-preservada', is_valid: true });
  // Confere o mapeamento real de sessão usado pelo NestJS.
  const orm = await new DataSource({
    ...connection,
    schema,
    entities: entityPaths,
    namingStrategy: new SnakeNamingStrategy(),
  }).initialize();
  try {
    const repository = orm.getRepository(Session);
    const saved = await repository.save(
      repository.create({
        idUsuario: 1,
        token: 't'.repeat(400),
        expiresAt: new Date(Date.now() + 60000),
      }),
    );
    expect(typeof saved.idSession).toBe('number');
    expect(
      (await repository.findOneByOrFail({ idSession: saved.idSession }))
        .idUsuario,
    ).toBe(1);
  } finally {
    await orm.destroy();
  }
});

it('adota a estrutura anterior às mídias e chega ao mesmo esquema de um banco vazio', async () => {
  const fresh = await isolated();
  const legacy = await isolated(true);
  await fresh.source.runMigrations();
  expect(await legacy.source.runMigrations()).toHaveLength(3);
  const a = fresh.source.createQueryRunner();
  const b = legacy.source.createQueryRunner();
  try {
    expect(await schemaSignature(a, fresh.schema)).toEqual(
      await schemaSignature(b, legacy.schema),
    );
  } finally {
    await a.release();
    await b.release();
  }
});

it('recusa adoção de estrutura divergente e desfaz alterações', async () => {
  const { source, s } = await isolated(true, true);
  await source.query(`ALTER TABLE ${s}."user" DROP COLUMN phone`);
  await expect(source.runMigrations()).rejects.toThrow('Baseline recusada');
  expect(await source.query(`SELECT name FROM ${s}.migrations`)).toEqual([
    { name: 'IndependentMedia1789674000000' },
  ]);
  expect(
    (
      await source.query(
        `SELECT count(*)::int AS count FROM information_schema.columns WHERE table_schema=$1 AND table_name='session' AND column_name='is_valid'`,
        [(source.options as any).schema],
      )
    )[0].count,
  ).toBe(0);
});

it('bloqueia correção de documentos com referências sem correspondência', async () => {
  const { source, s } = await isolated(true, true);
  await source.query(
    `ALTER TABLE ${s}.documents DROP CONSTRAINT documents_id_print_fkey`,
  );
  await source.query(
    `INSERT INTO ${s}.documents(title,origin,id_print) VALUES ('Teste','Teste',999)`,
  );
  const runner = source.createQueryRunner();
  try {
    await expect(
      new AlignSessionsAndDocuments1790200000000().up(runner),
    ).rejects.toThrow('sem correspondência');
  } finally {
    await runner.release();
  }
});

it('não oferece rollback que apaga os dados da baseline ou de sessões', async () => {
  await expect(new InitialMuseum1789600000000().down()).rejects.toThrow(
    'não remove',
  );
  await expect(
    new AlignSessionsAndDocuments1790200000000().down(),
  ).rejects.toThrow('preservar');
});
