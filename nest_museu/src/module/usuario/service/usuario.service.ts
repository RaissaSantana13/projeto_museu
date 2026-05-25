import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { GenericConverter } from '../../../commons/converter/converter.commons';
import { BaseService } from '../../../commons/entities/base.service';
import PostgresErrorCode from '../../../commons/enum/postgres-error-code.enum';
import { EmailException } from '../../../commons/exceptions/error/email.exception';
import { EntityNotFoundException } from '../../../commons/exceptions/error/entity-not-found.exception';
import { ServerErrorExceptions } from '../../../commons/exceptions/error/server-error.exception';
import { Pageable } from '../../../commons/pagination/page.response';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { AUTH } from '../../auth/constants/login.constants';
import { RegisterUsuarioRequest } from '../../auth/dto/request/register.usuario.request';
import { Credentials } from '../../auth/entities/credentials.entity';
import EmailService from '../../email/service/email.service';
import { fieldsUsuario, USUARIO } from '../constants/usuario.constants';
import { UsuarioConverter } from '../dto/converter/usuario.converter';
import { UsuarioRequest } from '../dto/request/usuario.request';
import { UsuarioResponse } from '../dto/response/usuario.response';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuarioService extends BaseService<Usuario> {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Credentials)
    private credentialsRepository: Repository<Credentials>,
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super(usuarioRepository);
  }

  async listar(
    page: number,
    pageSize: number,
    field: string,
    order: string,
    search?: string,
  ): Promise<Page<UsuarioResponse>> {
    const pageable = new Pageable(page, pageSize, field, order, fieldsUsuario);
    try {
      const query = this.usuarioRepository
        .createQueryBuilder(USUARIO.ENTITY)
        .innerJoin('usuario.credentials', 'cred')
        .select('usuario.id_usuario', 'idUsuario')
        .addSelect('cred.email', 'email')
        .where('usuario.deleted_at IS NULL')
        .andWhere('cred.deleted_at IS NULL');

      if (search) {
        query.where(`${USUARIO.ENTITY}.${field} LIKE :search`, {
          search: `%${search}%`,
        });
      }

      const usuarios = await query
        .orderBy(`${USUARIO.ENTITY}.${pageable.field}`, pageable.order)
        .skip(pageable.offset)
        .take(pageable.limit)
        .getRawMany();

      const totalElements = await query.getCount();

      const listaUsuarios = GenericConverter.toListResponse(
        UsuarioResponse,
        usuarios,
      );

      return Page.of(listaUsuarios, totalElements, pageable);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        USUARIO.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async porId(id: number): Promise<UsuarioResponse | null> {
    const usuario = await this.buscarPorId(id);

    if (!usuario) {
      throw new EntityNotFoundException(
        USUARIO.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    return GenericConverter.toResponse(UsuarioResponse, usuario);
  }

  async salvar(usuarioRequest: UsuarioRequest): Promise<UsuarioResponse> {
    const passwordHash = await bcrypt.hash(usuarioRequest.password, 10);

    try {
      return await this.dataSource.transaction(async (manager) => {
        const novoUsuario = manager.create(Usuario, {
          firstName: usuarioRequest.firstName,
          lastName: usuarioRequest.lastName,
          username: usuarioRequest.username,
          imagePath: usuarioRequest.imagePath,
          emailConfirmado: false, // Inicializa como não confirmado
        });
        if (usuarioRequest.roleIds?.length > 0) {
          novoUsuario.role = usuarioRequest.roleIds.map((id) => ({
            idRoles: id,
          })) as any;
        }
        const usuarioSalvo = await manager.save(Usuario, novoUsuario);

        const credentials = manager.create(Credentials, {
          email: usuarioRequest.email,
          password: passwordHash,
          usuarioId: usuarioSalvo.idUsuario,
        });

        await manager.save(Credentials, credentials);
        return GenericConverter.toResponse(UsuarioResponse, usuarioSalvo);
      });
    } catch (error: any) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new EmailException(USUARIO.MENSAGEM.EMAIL_CADASTRADO);
      }
      throw new ServerErrorExceptions(USUARIO.MENSAGEM.SERVER_ERROR);
    }
  }

  async atualizar(
    id: number,
    usuarioRequest: UsuarioRequest,
  ): Promise<UsuarioResponse | null> {
    const usuarioCadastrado = await this.porId(id);

    if (!usuarioCadastrado) {
      throw new EntityNotFoundException(
        USUARIO.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    return await this.dataSource.transaction(async (manager) => {
      try {
        const dadosNovos = UsuarioConverter.toUsuario(usuarioRequest);
        Object.assign(usuarioCadastrado, dadosNovos);

        if (usuarioRequest.roleIds) {
          usuarioCadastrado.roles = usuarioRequest.roleIds.map((roleId) => ({
            idRoles: roleId,
          })) as any;
        }

        const usuarioAtualizado = await manager.save(
          Usuario,
          usuarioCadastrado,
        );

        await manager.update(
          Credentials,
          { usuarioId: id },
          { email: usuarioRequest.email },
        );

        return GenericConverter.toResponse(UsuarioResponse, usuarioAtualizado);
      } catch (error: any) {
        if (error.code === PostgresErrorCode.UniqueViolation) {
          throw new EmailException(USUARIO.MENSAGEM.EMAIL_CADASTRADO);
        }
        throw new ServerErrorExceptions(
          USUARIO.MENSAGEM.SERVER_ERROR,
          error.message,
        );
      }
    });
  }

  async excluir(id: number): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: id },
      relations: ['credentials'],
    });

    if (!usuario) {
      throw new EntityNotFoundException(
        USUARIO.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    try {
      await this.usuarioRepository.softRemove(usuario);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        USUARIO.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async buscarPorId(id: number): Promise<Usuario> {
    try {
      const usuario = await this.usuarioRepository
        .createQueryBuilder('usuario') // Nome da entidade
        .leftJoinAndSelect('usuario.roles', 'roles') // Carrega as roles atuais
        .where('usuario.idUsuario = :id', { id })
        .getOne();

      if (!usuario) {
        throw new EntityNotFoundException(
          USUARIO.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }
      return usuario;
    } catch (error: any) {
      throw new ServerErrorExceptions(
        USUARIO.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async markEmailAsConfirmed(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        const credentials = await this.credentialsRepository.findOne({
          where: { email: payload.email },
          relations: ['usuario'],
        });

        if (!credentials) {
          throw new EntityNotFoundException(
            USUARIO.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
          );
        }

        if (credentials.usuario.emailVerified) {
          throw new EmailException(AUTH.MENSAGEM.EMAIL_CONFIRMADO_NO_SISTEMA);
        }

        credentials.usuario.emailVerified = true;
        await this.usuarioRepository.save(credentials.usuario);

        await this.emailService.sendEmailConfirmed(
          credentials.email,
          credentials.usuario.firstName,
        );
      }
    } catch (error: any) {
      throw new BadRequestException(
        USUARIO.MENSAGEM.TOKEN_INVALIDO_EXPIRADO,
        error.message,
      );
    }
  }

  async setTwoFactorAuthenticationSecret(
    code: string,
    expiresAt: Date,
    userId: number,
  ) {
    return this.usuarioRepository.update(userId, {
      mfaCode: code,
      mfaExpiresAt: expiresAt,
    });
  }

  async removeRefreshToken(userId: number) {
    return await this.usuarioRepository.update(userId, {
      currentHashedRefreshToken: '',
    });
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.usuarioRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usuarioRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: userId },
    });
    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }
    const isMatching = await bcrypt.compare(
      refreshToken,
      usuario.currentHashedRefreshToken ?? '',
    );
    if (isMatching) return usuario;
    throw new UnauthorizedException('Refresh token inválido.');
  }

  async hashedRefreshToken(userId: number) {
    try {
      await this.usuarioRepository.update(userId, {
        currentHashedRefreshToken: '',
      });

      return { message: 'Senha redefinida com sucesso!' };
    } catch (error: any) {
      throw new BadRequestException(
        'Token de recuperação inválido ou expirado.',
        error.message,
      );
    }
  }

  //####################### Rotina para criar o registro do usuário  ###################

  async registrarUsuario(registerUsuarioRequest: RegisterUsuarioRequest) {
    let usuarioSalvoResponse: UsuarioResponse;
    try {
      usuarioSalvoResponse = await this.dataSource.transaction(
        async (manager) => {
          const novoUsuario = GenericConverter.toEntity(
            Usuario,
            registerUsuarioRequest,
          );

          const usuarioSalvo = await manager.save(Usuario, novoUsuario);

          const passwordHash = await bcrypt.hash(
            registerUsuarioRequest.password,
            10,
          );

          const credentials = manager.create(Credentials, {
            email: registerUsuarioRequest.email,
            passwordHash,
            usuarioId: usuarioSalvo.idUsuario,
          });

          await manager.save(Credentials, credentials);

          return GenericConverter.toResponse(UsuarioResponse, usuarioSalvo);
        },
      );

      const payload = { email: registerUsuarioRequest.email };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.getOrThrow('JWT_VERIFICATION_TOKEN_SECRET'),
        expiresIn: '900s', // 15 minutos
      });

      await this.emailService.sendRegisterConfirmation(
        registerUsuarioRequest.email,
        registerUsuarioRequest.firstName,
        token,
      );

      return usuarioSalvoResponse;
    } catch (error: any) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new EmailException(USUARIO.MENSAGEM.EMAIL_CADASTRADO);
      }

      throw new ServerErrorExceptions(
        USUARIO.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }
}
