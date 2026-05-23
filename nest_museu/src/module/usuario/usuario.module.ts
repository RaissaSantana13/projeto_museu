import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioController } from './controller/usuario.controller';
import { Usuario } from './entities/usuario.entity';
import { UsuarioService } from './service/usuario.service';

import { Roles } from '../access/entities/role.entity';
import { Credentials } from '../auth/entities/credentials.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Roles, Credentials]),
    forwardRef(() => EmailModule),
  ],
  exports: [UsuarioService],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}
