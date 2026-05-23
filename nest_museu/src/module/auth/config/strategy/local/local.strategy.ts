import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-local';
import { Usuario } from '../../../../usuario/entities/usuario.entity';
import { AuthenticationService } from '../../../service/authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }
  async validate(email: string, password: string): Promise<Usuario> {
    const credentials = await this.authenticationService.getAuthenticatedUser(
      email,
      password,
    );
    return credentials.usuario;
  }
}
