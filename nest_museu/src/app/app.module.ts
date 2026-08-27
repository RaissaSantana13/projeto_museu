import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { resolve } from 'path';
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
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // IMPORTANTE: Na v5+, o TTL é em MILISSEGUNDOS (60000ms = 1 minuto)
        limit: 10, // Número de requisições
      },
    ]),

    ServeStaticModule.forRoot({
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
