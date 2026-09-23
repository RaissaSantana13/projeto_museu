import 'dotenv/config';
import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DataSource, Repository } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { mkdtemp, mkdir, readdir, readFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';
import request = require('supertest');
import { ArtworkMediaModule } from '../src/module/artwork-media/artwork-media.module';
import { ArtworkMedia } from '../src/module/artwork-media/entities/artwork-media.entity';
import { Artwork } from '../src/module/artwork/entities/artwork.entity';
import { IndependentMedia1789674000000 } from '../src/database/migrations/1789674000000-IndependentMedia';

describe('Arquivos: HTTP, disco e PostgreSQL isolado', () => {
  let app: INestApplication;
  let admin: DataSource;
  let repository: Repository<ArtworkMedia>;
  let artworks: Repository<Artwork>;
  let root: string;
  const schema = `media_test_${randomUUID().replaceAll('-', '')}`;
  const previousRoot = process.env.MEDIA_STORAGE_ROOT;
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII=',
    'base64',
  );

  beforeAll(async () => {
    root = await mkdtemp(join(tmpdir(), 'museu-media-test-'));
    await mkdir(join(root, 'files'));
    process.env.MEDIA_STORAGE_ROOT = root;
    const connection = {
      type: 'postgres' as const,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    };
    admin = await new DataSource(connection).initialize();
    await admin.query(`CREATE SCHEMA "${schema}"`);
    const migrationSource = await new DataSource({
      ...connection,
      schema,
    }).initialize();
    const runner = migrationSource.createQueryRunner();
    try {
      await runner.query(
        `CREATE TABLE "${schema}".works (id_artwork serial PRIMARY KEY)`,
      );
      await runner.query(`CREATE TABLE "${schema}".artwork_media (
        id_media serial PRIMARY KEY,
        id_artwork integer NOT NULL REFERENCES "${schema}".works(id_artwork) ON DELETE CASCADE,
        media_type varchar(20) NOT NULL, url text, is_main boolean NOT NULL DEFAULT false,
        created_at timestamp NOT NULL DEFAULT now(), updated_at timestamp NOT NULL DEFAULT now(),
        deleted_at timestamp, file_data bytea
      )`);
      await new IndependentMedia1789674000000().up(runner);
      const table = await runner.getTable(`${schema}.artwork_media`);
      expect(table!.findColumnByName('id_artwork')!.isNullable).toBe(true);
      expect(table!.foreignKeys[0].onDelete).toBe('SET NULL');
      expect(table!.findColumnByName('original_name')).toBeDefined();
    } finally {
      await runner.release();
      await migrationSource.destroy();
    }
    @Module({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        TypeOrmModule.forRoot({
          ...connection,
          schema,
          entities: [ArtworkMedia, Artwork],
          synchronize: true,
          namingStrategy: new SnakeNamingStrategy(),
        }),
        ArtworkMediaModule,
        ServeStaticModule.forRoot({
          rootPath: join(root, 'files'),
          serveRoot: '/media/files',
          serveStaticOptions: { index: false },
        }),
      ],
    })
    class MediaTestModule {}
    app = await NestFactory.create(MediaTestModule, {
      logger: false,
      abortOnError: false,
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    repository = app.get(DataSource).getRepository(ArtworkMedia);
    artworks = app.get(DataSource).getRepository(Artwork);
  }, 30000);

  afterAll(async () => {
    await app?.close();
    if (admin?.isInitialized) {
      // Somente o schema aleatório criado por este teste pode ser removido.
      if (!/^media_test_[a-f0-9]{32}$/.test(schema))
        throw new Error('Schema inválido');
      await admin.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
      await admin.destroy();
    }
    if (root && root.startsWith(join(tmpdir(), 'museu-media-test-')))
      await rm(root, { recursive: true, force: true });
    if (previousRoot === undefined) delete process.env.MEDIA_STORAGE_ROOT;
    else process.env.MEDIA_STORAGE_ROOT = previousRoot;
  });

  it('documenta seletores único/múltiplo e obra opcional no Swagger', () => {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().build(),
    );
    const single = document.paths['/api/v1/files/upload'].post!;
    const multiple = document.paths['/api/v1/files/upload-multiple'].post!;
    expect(JSON.stringify(single.requestBody)).toContain('binary');
    expect(JSON.stringify(multiple.requestBody)).toContain('array');
    expect(single.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'idArtwork', required: false }),
      ]),
    );
  });

  it('envia imagem e documento sem obra e entrega exatamente o conteúdo gravado', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/files/upload-multiple')
      .attach('files', png, 'foto.png')
      .attach('files', Buffer.from('%PDF-1.4\nfixture'), 'documento.pdf')
      .expect(201);
    expect(response.body.status).toBe(201);
    expect(response.body.dados).toHaveLength(2);
    for (const media of response.body.dados) {
      expect(media.idArtwork).toBeNull();
      expect(media.mediaType).toBeNull();
      const saved = await repository.findOneByOrFail({
        idMedia: media.idMedia,
      });
      expect(saved.url).toBe(media.url);
      const disk = await readFile(
        join(root, 'files', media.url.split('/').pop()),
      );
      const downloaded = await request(app.getHttpServer())
        .get(media.url)
        .expect(200);
      expect(downloaded.body).toEqual(disk);
      expect(String(disk.length)).toBe(media.sizeBytes);
    }
  });

  it('mantém a rota antiga e permite classificar o arquivo depois', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/artwork_media/upload')
      .attach('file', Buffer.from('video fixture'), 'video.mp4')
      .expect(201);
    const id = response.body.dados.idMedia;
    const updated = await request(app.getHttpServer())
      .patch(`/api/v1/files/${id}/metadata`)
      .send({ mediaType: 'video' })
      .expect(200);
    expect(updated.body.dados.mediaType).toBe('video');
    expect(updated.body.dados.mimeType).toBe('video/mp4');
    expect(updated.body._links.self.href).toBe(`/api/v1/files/${id}`);
  });

  it('limpa arquivos em falha de validação, obra inexistente e falha do banco', async () => {
    const before = await readdir(join(root, 'files'));
    await request(app.getHttpServer())
      .post('/api/v1/files/upload?idArtwork=abc')
      .attach('file', png, 'foto.png')
      .expect(400);
    await request(app.getHttpServer())
      .post('/api/v1/files/upload?idArtwork=2147483647')
      .attach('file', png, 'foto.png')
      .expect(400);
    const save = jest
      .spyOn(repository, 'save')
      .mockRejectedValueOnce(new Error('Falha de banco simulada'));
    try {
      await request(app.getHttpServer())
        .post('/api/v1/files/upload-multiple')
        .attach('files', png, 'a.png')
        .attach('files', png, 'b.png')
        .expect(500);
    } finally {
      save.mockRestore();
    }
    expect(await readdir(join(root, 'files'))).toEqual(before);
  });

  it('preserva mídias na exclusão lógica e física de uma obra', async () => {
    const artwork = await artworks.save(
      artworks.create({ title: 'Obra de teste', type: 'Pintura' }),
    );
    const result = await request(app.getHttpServer())
      .post(`/api/v1/files/upload?idArtwork=${artwork.idArtwork}`)
      .attach('file', png, 'obra.png')
      .expect(201);
    const id = result.body.dados.idMedia;
    const loaded = await artworks.findOneOrFail({
      where: { idArtwork: artwork.idArtwork },
      relations: ['medias'],
    });
    await artworks.softRemove(loaded);
    expect(await repository.findOneBy({ idMedia: id })).not.toBeNull();
    await artworks.delete(artwork.idArtwork);
    expect(
      (await repository.findOneByOrFail({ idMedia: id })).idArtwork,
    ).toBeNull();
    await request(app.getHttpServer()).get(result.body.dados.url).expect(200);
  });

  it('recusa requisição sem arquivos', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/files/upload-multiple')
      .expect(400);
  });
});
