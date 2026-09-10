import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkMediaController } from './controller/artwork-media.controller';
import { ArtworkMedia } from './entities/artwork-media.entity';
import { ArtworkMediaService } from './service/artwork-media.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArtworkMedia])],
  controllers: [ArtworkMediaController],
  providers: [ArtworkMediaService],
  exports: [ArtworkMediaService],
})
export class ArtworkMediaModule {}
