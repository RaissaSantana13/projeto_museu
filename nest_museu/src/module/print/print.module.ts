import { TypeOrmModule } from '@nestjs/typeorm';
import { Print } from './entities/print.entity';
import { PrintController } from './controller/print.controller';
import { PrintService } from './service/print.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Print])],
  controllers: [PrintController],
  providers: [PrintService],
  exports: [PrintService],
})
export class PrintModule {}
