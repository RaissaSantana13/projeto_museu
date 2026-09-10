import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
//import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import DatabaseLogger from './database.logger';

@Module({
  imports: [
    CacheModule.register({ ttl: 3600, isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DB_HOST'),
        port: config.getOrThrow<number>('DB_PORT'),
        username: config.getOrThrow<string>('DB_USER'),
        password: config.getOrThrow<string>('DB_PASS'),
        database: config.getOrThrow<string>('DB_NAME'),
        schema: config.getOrThrow<string>('DB_SCHEMA'),
        //entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        autoLoadEntities: true,
        synchronize: false,
        logger: new DatabaseLogger(),
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class DataBaseModule {}
