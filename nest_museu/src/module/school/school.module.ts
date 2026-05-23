import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolController } from './controller/school.controller';
import { SchoolRepresentative } from './entities/school-representative.entity';
import { School } from './entities/school.entity';
import { SchoolService } from './service/school.service';

@Module({
  imports: [
    // Registra as entidades do módulo para que o TypeORM possa injetar os repositórios
    TypeOrmModule.forFeature([School, SchoolRepresentative]),
  ],
  controllers: [
    // Registra o controlador que lida com as rotas HTTP de e scola
    SchoolController,
  ],
  providers: [
    // Registra o serviço que contém a lógica de negócio
    SchoolService,
  ],
  exports: [
    // Exporta o SchoolService caso outros módulos precisem consultar dados de escolas
    SchoolService,
  ],
})
export class SchoolModule {}
