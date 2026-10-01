import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { join, resolve } from 'path';
import { mediaStorageRoot } from '../module/artwork-media/storage/media-storage';
import { DataBaseModule } from '../database/database.module';
import { AcessoModule } from '../module/access/acesso.module';
import { AuthModule } from '../module/auth/auth.module';
import { ContactModule } from '../module/contact/contact.module';
import { EmailModule } from '../module/email/email.module';
import { EventModule } from '../module/event/event.module';
import { FotoModule } from '../module/imagem/foto.module';
import { ResourceModule } from '../module/resource/resource.module';
import { UsuarioModule } from '../module/usuario/usuario.module';
import { SchoolModule } from '../module/school/school.module';
import { ArtworkModule } from '../module/artwork/artwork.module';
import { PrintModule } from '../module/print/print.module';
import { DocumentModule } from '../module/document/document.module';
import { ArtworkMediaModule } from '../module/artwork-media/artwork-media.module';

const modules = [
  DataBaseModule,
  UsuarioModule,
  FotoModule,
  AuthModule,
  ContactModule,
  EventModule,
  ResourceModule,
  EmailModule,
  SchoolModule,
  AcessoModule,
  ArtworkModule,
  ArtworkMediaModule,
  PrintModule,
  DocumentModule,
];

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const loadTest = config.get<string>('K6_LOAD_TEST') === 'true';
        const environment = config.get<string>('NODE_ENV');
        if (loadTest && !['development', 'test'].includes(environment ?? '')) {
          throw new Error('K6_LOAD_TEST exige NODE_ENV=development ou test.');
        }
        return [{ ttl: 60000, limit: loadTest ? 100000 : 10 }];
      },
    }),

    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          rootPath: join(
            mediaStorageRoot(config.get<string>('MEDIA_STORAGE_ROOT')),
            'files',
          ),
          serveRoot: '/media/files',
          serveStaticOptions: { index: false, fallthrough: false },
        },
        {
          // Resolve transforma o caminho em absoluto para o SO
          // Se for Linux: '/uploads_projeto_museu'
          // Se for Windows: 'C:\\uploads_projeto_museu'
          rootPath: resolve('/uploads_projeto_museu'),

          // Esse é o prefixo da URL.
          // Ex: http://localhost:3000/media/pecas/foto.jpg
          serveRoot: '/media',

          // Configurações extras úteis
          serveStaticOptions: {
            index: false, // Desativa procurar por index.html
          },
        },
      ],
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ...modules,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
