import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { AppModule } from './app/app.module';

import { FIELD_LABEL_KEY } from './commons/decorators/validation/field.metadata';
import { SIS_MUSEU } from './commons/enum/sis-museu.enum';
import { GlobalExceptionFilter } from './commons/exceptions/filter/global.filter';
import { UnprocesseableEntityExceptionFilter } from './commons/exceptions/filter/unprocesseable.entity.filter';
import { UsuarioResponse } from './module/usuario/dto/response/usuario.response';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(SIS_MUSEU.ROTA_VERSIONAMENTO);

  app.useGlobalFilters(
    new UnprocesseableEntityExceptionFilter(),
    new GlobalExceptionFilter(),
  );

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não existem no DTO
      transform: true, // Transforma os dados automaticamente para os tipos definidos nos DTOs
      forbidNonWhitelisted: true, //aborta a requisição e é bloqueada
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, // Define 422 como o status padrão para erros de validação
      exceptionFactory: (errors) => {
        return new UnprocessableEntityException(
          errors.map((error) => {
            const label =
              Reflect.getMetadata(
                FIELD_LABEL_KEY,
                error.target?.constructor?.prototype,
                error.property,
              ) ?? error.property;
            return {
              campo: label,
              mensagens: Object.values(error.constraints ?? {}),
            };
          }),
        );
      },
    }),
  );

  app.enableCors({
    origin: configService.getOrThrow<string>(SIS_MUSEU.FRONTEND_URL),
    methods: 'GET,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: false,
  });

  const configSwagger = new DocumentBuilder()
    .setTitle(SIS_MUSEU.TITULO_SISTEMA)
    .setDescription(SIS_MUSEU.API_DESCRICAO)
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger, {
    extraModels: [UsuarioResponse],
  });

  SwaggerModule.setup('docs', app, document);

  const port = configService.getOrThrow<number>(SIS_MUSEU.PORT) || 5000;

  await app.listen(port);
}
bootstrap().catch((err) => {
  console.error(SIS_MUSEU.ERRO_SERVIDOR_BOOTSTRAP, err);
  process.exit(1);
});
