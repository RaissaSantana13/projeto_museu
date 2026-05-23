import { forwardRef, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { UsuarioModule } from '../usuario/usuario.module';

import EmailService from './service/email.service';
import { TemplateService } from './service/email.template.service';

@Global()
@Module({
  imports: [
    JwtModule.register({}),
    forwardRef(() => AuthModule),
    forwardRef(() => UsuarioModule),
  ],
  providers: [EmailService, TemplateService],
  exports: [EmailService],
  controllers: [],
})
export class EmailModule {}
