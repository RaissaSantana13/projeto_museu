import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../../commons/constants/mensagem.sistema';
import { ApiException } from '../../../../commons/exceptions/error/api.exception';
import { RequestWithUser } from './auth.guard';

@Injectable()
export class VerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        gerarMensagem(MENSAGEM_GENERICA.SESSION_REQUIRED),
      );
    }

    if (!request.user.isVerified) {
      throw new ApiException(
        HttpStatus.FORBIDDEN,
        gerarMensagem(MENSAGEM_GENERICA.EMAIL_NAO_CONFIRMADO_NO_SISTEMA),
      );
    }

    return true;
  }
}
