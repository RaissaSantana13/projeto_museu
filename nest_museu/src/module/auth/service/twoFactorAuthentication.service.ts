import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { UsuarioService } from '../../usuario/service/usuario.service';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(private readonly usuarioService: UsuarioService) {}

  async generateTwoFactorAuthenticationSecret(user: Usuario) {
    const digits = randomInt(100000, 999999).toString();
    const expiresIn = 10;
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + expiresIn);
    await this.usuarioService.setTwoFactorAuthenticationSecret(
      digits,
      expirationDate,
      user.idUsuario,
    );

    return {
      digits,
      expiresAt: expirationDate,
    };
  }

  public isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: Usuario,
  ) {
    const agora = new Date();

    const isCodeMatch = user.mfaCode === twoFactorAuthenticationCode;
    const isNotExpired = user.mfaExpiresAt ? agora < user.mfaExpiresAt : false;

    return isCodeMatch && isNotExpired;
  }
}
