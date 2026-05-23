import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkMedia } from './entities/artwork-media.entity';
import { ArtworkMediaController } from './controller/artwork-media.controller';
import { ArtworkMediaService } from './service/artwork-media.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([ArtworkMedia])],
  controllers: [ArtworkMediaController],
  providers: [ArtworkMediaService],
  exports: [ArtworkMediaService],
})
export class ArtworkMediaModule {}
