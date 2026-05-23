import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseOAuthStrategy } from './base-oauth.strategy';
import { OAuthAccountProfile } from './oauth.strategy.interface';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

interface GoogleUserProfileResponse {
  id: number;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

@Injectable()
export class GoogleOAuthStrategy extends BaseOAuthStrategy {
  private readonly AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  private readonly TOKEN_URL = 'https://oauth2.googleapis.com/token';
  private readonly USER_INFO_URL =
    'https://www.googleapis.com/oauth2/v2/userinfo';

  constructor(configService: ConfigService) {
    super(configService, 'google');
  }

  protected getScopes(): string[] {
    return ['openid', 'email', 'profile'];
  }

  getAuthorizationUrl(state?: string): string {
    const config = this.ensureEnabled();
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.callbackUrl,
      response_type: 'code',
      scope: config.scopes.join(' '),
      access_type: 'offline', // Necessário para receber o refresh_token
      prompt: 'consent',
    });

    if (state) {
      params.append('state', state);
    }

    return `${this.AUTH_URL}?${params.toString()}`;
  }

  async getAccountProfile(
    code: string,
    state?: string,
  ): Promise<OAuthAccountProfile> {
    const config = this.ensureEnabled();
    try {
      // 1. Troca o código pelo token
      const tokenResponse = await this.httpPostForm<GoogleTokenResponse>(
        this.TOKEN_URL,
        {
          code,
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: config.callbackUrl,
          grant_type: 'authorization_code',
        },
      );

      this.logger.log(`Successfully obtained access token for Google OAuth`);

      // 2. Busca os dados do perfil do usuário
      const userProfile = await this.httpGet<GoogleUserProfileResponse>(
        this.USER_INFO_URL,
        {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      );

      // Validação de segurança
      if (!userProfile.verified_email) {
        throw new Error('Google email is not verified');
      }

      // 3. Monta o objeto padronizado para o seu Service
      // Calculamos a data de expiração baseada no 'expires_in' (segundos)
      const now = new Date();
      const accessTokenExpiresAt = new Date(
        now.getTime() + tokenResponse.expires_in * 1000,
      );

      return {
        // Dados para a tabela 'usuario' e 'credentials'
        email: userProfile.email,
        name: userProfile.name,
        firstName: userProfile.given_name,
        lastName: userProfile.family_name,
        picture: userProfile.picture,
        emailVerified: userProfile.verified_email,

        // Dados para a tabela 'account' (Postgres)
        providerId: userProfile.id, // Convertendo para string por segurança
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token || '', // Pode ser undefined se não for a primeira vez
        accessTokenExpiresAt: accessTokenExpiresAt,
        //refreshTokenExpiresAt: null, // Google não costuma enviar expiração fixa para refresh_token
        scope: tokenResponse.scope,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get Google user profile: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
