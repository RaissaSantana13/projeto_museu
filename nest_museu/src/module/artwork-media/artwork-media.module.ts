import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { mediaDiskStorage, mediaStorageRoot } from './storage/media-storage';
import { UploadCleanupInterceptor } from './storage/upload-cleanup.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkMediaController } from './controller/artwork-media.controller';
import { ArtworkMedia } from './entities/artwork-media.entity';
import { ArtworkMediaService } from './service/artwork-media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArtworkMedia]),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        storage: mediaDiskStorage(
          mediaStorageRoot(config.get<string>('MEDIA_STORAGE_ROOT')),
        ),
      }),
    }),
  ],
  controllers: [ArtworkMediaController],
  providers: [ArtworkMediaService, UploadCleanupInterceptor],
  exports: [ArtworkMediaService],
})
export class ArtworkMediaModule {}
