import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { join } from 'path';
import { entityPaths } from './entities';

if (!process.env.DB_SCHEMA)
  throw new Error('Defina DB_SCHEMA no .env antes de executar migrations.');

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  synchronize: false,
  installExtensions: false,
  namingStrategy: new SnakeNamingStrategy(),
  entities: entityPaths,
  migrations: [join(__dirname, 'migrations/*.{ts,js}')],
});
