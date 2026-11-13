import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Response } from 'express';

import { FacebookOAuthStrategy } from '../config/strategy/providers/facebook-oauth.strategy';
import { GitHubOAuthStrategy } from '../config/strategy/providers/github-oauth.strategy';
import { GoogleOAuthStrategy } from '../config/strategy/providers/google-oauth.strategy';
import {
  IOAuthStrategy,
  OAuthAccountProfile,
} from '../config/strategy/providers/oauth.strategy.interface';
import { SessionService } from './session.service';
import { AuthenticationService } from './authentication.service';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

/**
 * OAuth Provider Type
 */
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../commons/constants/mensagem.sistema';
import { ApiException } from '../../../commons/exceptions/error/api.exception';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Account } from '../entities/account.entity';
import { Credentials } from '../entities/credentials.entity';

export type OAuthProvider = 'google' | 'facebook' | 'github';

@Injectable()
export class OAuthService {
  private readonly logger = new Logger(OAuthService.name);
  private readonly strategies: Map<OAuthProvider, IOAuthStrategy> = new Map();

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Credentials)
    private readonly credentialsRepository: Repository<Credentials>,
    private readonly dataSource: DataSource, // Usado para transações
    private readonly sessionService: SessionService,
    private readonly authenticationService: AuthenticationService,
    private readonly configService: ConfigService,
    private readonly googleStrategy: GoogleOAuthStrategy,
    private readonly githubStrategy: GitHubOAuthStrategy,
    private readonly facebookStrategy: FacebookOAuthStrategy,
  ) {
    this.registerStrategies();
  }

  get frontendUrl(): string {
    return this.configService.get<string>('FRONTEND_URL', 'http://localhost:6001');
  }

  async handleGoogleCallback(code: string, state: string, request: Request, response: Response) {
    const profile = await this.getStrategy('google').getAccountProfile(code, state);
    if (!profile.email || !profile.accountId) throw new Error('Perfil Google incompleto');
    const usuario = await this.findOrCreateUser('google', profile);
    const access = this.authenticationService.getCookieWithJwtAccessToken(usuario.idUsuario);
    const refresh = this.authenticationService.getCookieWithJwtRefreshToken(usuario.idUsuario);
    await this.usuarioRepository.update(usuario.idUsuario, { currentHashedRefreshToken: await bcrypt.hash(refresh.token, 10) });
    await this.sessionService.salvar({
      idUsuario: usuario.idUsuario,
      token: refresh.token,
      ipAddress: request.ip ?? '0.0.0.0',
      userAgent: String(request.headers['user-agent'] ?? 'unknown'),
      expiresAt: refresh.expiresRefreshToken,
    });
    response.setHeader('Set-Cookie', [access.cookie, refresh.cookie]);
  }

  getGoogleAuthorization(): { url: string; state: string } {
    const strategy = this.getStrategy('google');
    const state = this.generateState();
    return { url: strategy.getAuthorizationUrl(state), state };
  }
  private registerStrategies(): void {
    const allStrategies: [OAuthProvider, IOAuthStrategy][] = [
      ['google', this.googleStrategy],
      ['github', this.githubStrategy],
      ['facebook', this.facebookStrategy],
    ];

    for (const [provider, strategy] of allStrategies) {
      if (strategy.isEnabled) {
        this.strategies.set(provider, strategy);
      }
    }
  }

  private getStrategy(provider: OAuthProvider): IOAuthStrategy {
    const strategy = this.strategies.get(provider);

    if (!strategy) {
      const knownProviders: OAuthProvider[] = ['google', 'facebook', 'github'];
      if (knownProviders.includes(provider)) {
        const errorCodeMap: Record<OAuthProvider, MENSAGEM_GENERICA> = {
          google: MENSAGEM_GENERICA.GOOGLE_NOT_CONFIGURED,
          facebook: MENSAGEM_GENERICA.FACEBOOK_NOT_CONFIGURED,
          github: MENSAGEM_GENERICA.GITHUB_NOT_CONFIGURED,
        };
        throw new ApiException(
          HttpStatus.SERVICE_UNAVAILABLE,
          errorCodeMap[provider],
        );
      }

      throw new ApiException(
        HttpStatus.BAD_REQUEST,
        gerarMensagem(MENSAGEM_GENERICA.INVALID_OAUTH_PROVIDER),
      );
    }

    return strategy;
  }

  getAuthorizationUrl(provider: OAuthProvider): string {
    const strategy = this.getStrategy(provider);
    const state = this.generateState();
    return strategy.getAuthorizationUrl(state);
  }

  private generateState(): string {
    return randomBytes(32).toString('hex');
  }

  async handleCallback(
    provider: OAuthProvider,
    code: string,
    state: string,
    response: Response,
  ): Promise<any> {
    try {
      const strategy = this.getStrategy(provider);
      const oauthProfile = await strategy.getAccountProfile(code, state);

      // Busca ou cria o usuário baseado na nova estrutura SQL
      const usuario = await this.findOrCreateUser(provider, oauthProfile);

      // Criação de sessão (usando o id_usuario do Postgres)
      const userAgent = response.req.headers['user-agent'] || 'Unknown';
      const ip = response.req.ip || '127.0.0.1';

      const sessionToken = await this.sessionService.createSession(
        usuario.idUsuario,
        userAgent,
        ip,
      );

      this.setCookie(response, sessionToken);

      return {
        id: usuario.idUsuario,
        email: oauthProfile.email,
        name: `${usuario.firstName} ${usuario.lastName}`,
        provider,
      };
    } catch (error: any) {
      this.logger.error(`OAuth failed: ${error.message}`);
      throw error;
    }
  }

  private async findOrCreateUser(
    provider: OAuthProvider,
    profile: OAuthAccountProfile,
  ): Promise<Usuario> {
    // 1. Tenta encontrar se este provedor já está vinculado a alguma conta
    const existingAccount = await this.accountRepository.findOne({
      where: {
        providerId: provider,
        accountId: profile.accountId ?? String(profile.providerId),
      },
      relations: ['usuario'],
    });

    if (existingAccount) {
      return existingAccount.usuario;
    }

    // 2. Se não tem a "account", verifica se o e-mail já existe nas "credentials"
    const existingCredentials = await this.credentialsRepository.findOne({
      where: { email: profile.email },
      relations: ['usuario'],
    });

    if (existingCredentials) {
      // O usuário existe (login local), vamos apenas vincular a nova conta OAuth
      await this.linkAccount(existingCredentials.usuario.idUsuario, profile, provider);
      return existingCredentials.usuario;
    }

    // 3. Usuário totalmente novo: Criar Usuario + Account (usando Transação)
    return await this.dataSource.transaction(async (manager) => {
      const novoUsuario = manager.create(Usuario, {
        firstName: profile.firstName || profile.name || profile.email?.split('@')[0] || 'Usuário',
        lastName: profile.lastName || '',
        username: profile.email,
        emailVerified: true,
        imagePath: profile.picture,
      });

      const userSaved = await manager.save(novoUsuario);

      const novaAccount = manager.create(Account, {
        usuarioId: userSaved.idUsuario,
        providerId: provider,
        accessToken: profile.accessToken,
        accountId: profile.accountId ?? String(profile.providerId),
        refreshToken: profile.refreshToken,
        accessTokenExpiresAt: profile.accessTokenExpiresAt,
        //refreshTokenExpiresAt: profile.refreshTokenExpiresAt,
        scope: profile.scope,
      });

      await manager.save(novaAccount);
      return userSaved;
    });
  }

  private async linkAccount(userId: number, profile: OAuthAccountProfile, provider: OAuthProvider) {
    const account = this.accountRepository.create({
      usuarioId: userId,
      providerId: provider,
      accessToken: profile.accessToken,
      accountId: profile.accountId ?? String(profile.providerId),
      refreshToken: profile.refreshToken,
      accessTokenExpiresAt: profile.accessTokenExpiresAt,
      //refreshTokenExpiresAt: profile.refreshTokenExpiresAt,
      scope: profile.scope,
    });
    await this.accountRepository.save(account);
  }

  private setCookie(response: Response, token: string) {
    const cookieName = this.configService.get('session.cookieName', 'sid');
    response.cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.configService.get('session.cookieMaxAge', 604800000),
      path: '/',
    });
  }

  getSupportedProviders(): OAuthProvider[] {
    return Array.from(this.strategies.keys());
  }
}
