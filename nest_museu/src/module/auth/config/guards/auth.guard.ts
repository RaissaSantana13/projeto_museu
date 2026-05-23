import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../../commons/constants/mensagem.sistema';
import { ApiException } from '../../../../commons/excpetions/error/api.exceptions';
import { Roles } from '../../../access/entities/role.entity';
import { Usuario } from '../../../usuario/entities/usuario.entity';
import { Session } from '../../entities/session.entity';
import { SessionService } from '../../service/session.service';

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: Roles[];
    permissions: string[];
    isVerified: boolean;
  };
  session?: Session;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const cookieName = process.env.SESSION_COOKIE_NAME || 'sid';
    const sessionToken = request.cookies?.[cookieName] as string | undefined;

    if (!sessionToken) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        gerarMensagem(MENSAGEM_GENERICA.SESSION_REQUIRED),
      );
    }

    const session = await this.sessionService.validateSession(sessionToken);

    if (!session) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        gerarMensagem(MENSAGEM_GENERICA.SESSION_EXPIRED),
      );
    }

    // Attach user and session to request for use in controllers
    const usuario = session.usuario;

    // Compute effective permissions (role + direct)
    const effectivePermissions = await this.getEffectivePermissions(usuario);

    request.user = {
      id: usuario.idUsuario.toString(),
      email: usuario.credentials.email,
      name: usuario.firstName,
      role: usuario.role,
      permissions: effectivePermissions,
      isVerified: usuario.emailVerified,
    };
    request.session = session;

    return true;
  }

  /**
   * Get effective permissions for a user (role permissions + direct permissions).
   * @param user - User document
   * @returns Array of effective permissions (deduplicated)
   */
  private async getEffectivePermissions(usuario: Usuario): Promise<string[]> {
    const permissionsSet = new Set<string>();
    if (usuario.role && usuario.role.length > 0) {
      for (const role of usuario.role) {
        // Se as permissões já foram carregadas via 'relations' no findOne
        if (role.permissions) {
          role.permissions.forEach((p) =>
            permissionsSet.add(p.resource.nomeResources || p.action),
          );
        } else {
          const roleData = await this.rolesRepository.findOne({
            where: { idRoles: role.idRoles },
            relations: ['permissions'],
          });
          roleData?.permissions?.forEach((p) =>
            permissionsSet.add(p.resource.nomeResources || p.action),
          );
        }
      }
    }

    return Array.from(permissionsSet);
  }
}
