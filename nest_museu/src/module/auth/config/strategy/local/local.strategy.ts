import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Usuario } from '../../../../usuario/entities/usuario.entity';
import { AuthenticationService } from '../../../service/authentication.service';
import { Credentials } from '../../../entities/credentials.entity';

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
    const usuario = credentials.usuario;

    usuario.credentials = new Credentials({
      email: credentials.email,
    });

    return usuario;
  }
}
