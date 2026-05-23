import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '../../../commons/excpetions/error/badrequest.exceptions';
import { EntityNotFoundException } from '../../../commons/excpetions/error/entityNotFound.exceptions';
import { PasswordInvalidExceptions } from '../../../commons/excpetions/error/password.invalid.exceptions';
import { ServerErrorExceptions } from '../../../commons/excpetions/error/server.error.exceptions';
import EmailService from '../../email/service/email.service';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { UsuarioService } from '../../usuario/service/usuario.service';
import TokenPayload from '../config/tokenPayload.interface';
import { AUTH } from '../constants/login.constants';
import { Credentials } from '../entities/credentials.entity';

export interface RefreshTokenResult {
  cookie: string;
  token: string;
  expiresRefreshToken: Date;
}

export interface AccessTokenResult {
  cookie: string;
  token: string;
  expiresAccessToken: Date;
}

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(Credentials)
    private readonly credentialsRepository: Repository<Credentials>,
    @Inject(forwardRef(() => UsuarioService))
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
  ) {}

  public getCookieWithJwtAccessToken(
    userId: number,
    isSecondFactorAuthenticated = false,
  ): AccessTokenResult {
    const payload: TokenPayload = { userId, isSecondFactorAuthenticated };

    const secret = this.configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_SECRET',
    );
    const expiresInSeconds =
      this.configService.getOrThrow<number>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      ) ?? 3600;

    const token = this.jwtService.sign(payload, {
      secret,
      expiresIn: `${expiresInSeconds}s`,
    });

    const expiresAccessToken = new Date(Date.now() + expiresInSeconds * 1000);

    const cookie = this.getCookieAccessToken(token, expiresInSeconds);

    return {
      cookie,
      token,
      expiresAccessToken,
    };
  }

  private getCookieAccessToken(
    token: string,
    expiresInSeconds: number,
  ): string {
    return `Refresh=${token}; HttpOnly: true; Path=/; Max-Age=${expiresInSeconds}; SameSite=Strict`;
  }

  public getCookieWithJwtRefreshToken(userId: number): RefreshTokenResult {
    const payload: TokenPayload = { userId };

    const secret = this.configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_SECRET',
    );
    const expiresInSeconds = this.configService.getOrThrow<number>(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    );

    const token = this.jwtService.sign(payload, {
      secret,
      expiresIn: `${expiresInSeconds}s`,
    });

    const expiresRefreshToken = new Date(Date.now() + expiresInSeconds * 1000);

    const cookie = this.getCookieRefreshToken(token, expiresInSeconds);

    return {
      cookie,
      token,
      expiresRefreshToken,
    };
  }

  private getCookieRefreshToken(
    token: string,
    expiresInSeconds: number,
  ): string {
    return `Refresh=${token}; HttpOnly: true; Path=/; Max-Age=${expiresInSeconds}; SameSite=Strict`;
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  public async getAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ): Promise<Credentials> {
    try {
      const credentials = await this.getByEmail(email);
      await this.verifyPassword(plainTextPassword, credentials.password);
      if (!credentials.usuario.emailVerified) {
        throw new UnauthorizedException(
          AUTH.MENSAGEM.EMAIL_NAO_CONFIRMADO_NO_SISTEMA,
        );
      }
      return credentials;
    } catch (error: any) {
      throw new PasswordInvalidExceptions(
        AUTH.MENSAGEM.CREDENCIAL_INVALIDA,
        error.message,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new PasswordInvalidExceptions(AUTH.MENSAGEM.CREDENCIAL_INVALIDA);
    }
    return true;
  }

  public async getUserFromAuthenticationToken(
    token: string,
  ): Promise<Usuario | undefined> {
    const payload: TokenPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
    if (payload.userId) {
      return await this.usuarioService.buscarPorId(payload.userId);
    }
  }

  async getByEmail(email: string): Promise<Credentials> {
    try {
      const credentials = await this.credentialsRepository
        .createQueryBuilder(AUTH.ENTITY)
        .leftJoinAndSelect('credentials.usuario', 'usuario')
        .where(`${AUTH.SEARCH.POR_EMAIL} = :email`, { email })
        .getOne();
      if (!credentials) {
        throw new EntityNotFoundException(
          AUTH.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }
      return credentials;
    } catch (error: any) {
      throw new ServerErrorExceptions(
        AUTH.MENSAGEM.ERROR_SERVER,
        error.message,
      );
    }
  }

  // usuário logado, solicita a alteração de senha
  async changePassword(
    userId: number,
    password: string,
    confirmPassword: string,
  ): Promise<string> {
    if (password !== confirmPassword) {
      throw new PasswordInvalidExceptions(AUTH.MENSAGEM.CREDENCIAL_INVALIDA);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const credentials = await this.credentialsRepository
      .createQueryBuilder(AUTH.ENTITY)
      .leftJoinAndSelect('credentials.usuario', 'usuario')
      .where(`${AUTH.SEARCH.POR_USUARIO} = :userId`, { userId })
      .getOne();

    if (!credentials) {
      throw new EntityNotFoundException(AUTH.MENSAGEM.ENTIDADE_NAO_ENCONTRADA);
    }

    credentials.password = hashedPassword;
    await this.credentialsRepository.save(credentials);

    await this.emailService.sendChangePassword(
      credentials.email,
      credentials.usuario.firstName,
    );
    return AUTH.MENSAGEM.CREDENTIALS_UPDATE_SUCCESS;
  }

  // solicita a alteração de senha, não está logado
  async forgotPassword(email: string) {
    const credentials = await this.getByEmail(email);

    if (!credentials) {
      return AUTH.MENSAGEM.EMAIL_LOCALIZADO_NO_SISTEMA;
    }

    const payload = { email: credentials.email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: '900s', // 15 minutos
    });

    await this.emailService.sendresetPassword(
      credentials.email,
      credentials.usuario.firstName,
      token,
    );
    return AUTH.MENSAGEM.EMAIL_RECUPERACAO_ENVIADO;
  }

  //SOLICITA A ALTERAÇÃO DE SENHA
  async resetPassword(
    password: string,
    token: string,
  ): Promise<string | undefined> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        const credentials = await this.getByEmail(payload.email);

        if (!credentials) {
          throw new EntityNotFoundException(
            AUTH.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
          );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        credentials.password = hashedPassword;

        await this.credentialsRepository.save(credentials);

        await this.emailService.sendChangePassword(
          credentials.email,
          credentials.usuario.firstName,
        );

        return AUTH.MENSAGEM.CREDENTIALS_UPDATE_SUCCESS;
      }
    } catch (error: any) {
      throw new BadRequestException(
        AUTH.MENSAGEM.TOKEN_INVALIDO_EXPIRADO,
        error.message,
      );
    }
  }

  async sendResendEmail(email: string) {
    const credentials = await this.credentialsRepository.findOne({
      where: { email },
      relations: ['usuario'],
    });

    if (!credentials) {
      return;
    }

    if (credentials.usuario.emailVerified) {
      throw new BadRequestException(AUTH.MENSAGEM.EMAIL_CONFIRMADO_NO_SISTEMA);
    }

    const payload = { email: credentials.email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: '900s', // 15 min
    });

    await this.emailService.sendResendEmail(
      credentials.email,
      credentials.usuario.firstName,
      token,
    );
  }
}
