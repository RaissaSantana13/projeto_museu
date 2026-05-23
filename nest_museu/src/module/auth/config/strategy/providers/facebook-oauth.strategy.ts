import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseOAuthStrategy } from './base-oauth.strategy';
import { OAuthAccountProfile } from './oauth.strategy.interface';

/**
 * Facebook Token Response
 */
interface FacebookTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Facebook User Profile Response
 */
interface FacebookUserProfileResponse {
  id: number;
  email?: string;
  name: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

@Injectable()
export class FacebookOAuthStrategy extends BaseOAuthStrategy {
  private readonly AUTH_URL = 'https://www.facebook.com/v18.0/dialog/oauth';
  private readonly TOKEN_URL =
    'https://graph.facebook.com/v18.0/oauth/access_token';
  private readonly USER_INFO_URL = 'https://graph.facebook.com/v18.0/me';

  constructor(configService: ConfigService) {
    super(configService, 'facebook');
  }

  protected getScopes(): string[] {
    return ['email', 'public_profile'];
  }

  getAuthorizationUrl(state?: string): string {
    const config = this.ensureEnabled();
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.callbackUrl,
      scope: config.scopes.join(','),
      response_type: 'code',
    });

    if (state) {
      params.append('state', state);
    }

    return `${this.AUTH_URL}?${params.toString()}`;
  }

  async getAccountProfile(
    code: string,
    _state?: string,
  ): Promise<OAuthAccountProfile> {
    try {
      // 1. Troca o código pelo Token
      const tokenResponse = await this.exchangeCodeForToken(code);

      this.logger.log('Successfully obtained access token for Facebook OAuth');

      // 2. Busca o Perfil (Garante que os campos id, email, name, first_name e last_name sejam solicitados)
      const userProfile = await this.fetchUserProfile(
        tokenResponse.access_token,
      );

      if (!userProfile.email) {
        throw new Error('No email found on Facebook account');
      }

      // 3. Cálculo de datas
      const now = new Date();
      const accessTokenExpiresAt = new Date(
        now.getTime() + tokenResponse.expires_in * 1000,
      );

      // 4. Mapeamento para o formato unificado do Museu Virtual
      const names = userProfile.name.split(' ');

      return {
        // Dados para as tabelas 'usuario' e 'credentials'
        email: userProfile.email,
        name: userProfile.name,
        firstName: names[0], // Facebook nem sempre retorna given_name se não for solicitado, fazemos o split por segurança
        lastName: names.slice(1).join(' ') || ' ',
        picture: userProfile.picture?.data?.url || '',
        emailVerified: true, // Facebook valida o e-mail no ato do cadastro

        // Dados para a tabela 'account' no Postgres
        providerId: userProfile.id,
        accessToken: tokenResponse.access_token,
        refreshToken: '', // Facebook não retorna refresh_token por padrão neste fluxo
        accessTokenExpiresAt: accessTokenExpiresAt,
        //refreshTokenExpiresAt: null,
        scope: 'email,public_profile',
      };
    } catch (error) {
      this.logger.error(
        `Failed to get Facebook user profile: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  private async exchangeCodeForToken(
    code: string,
  ): Promise<FacebookTokenResponse> {
    const config = this.ensureEnabled();
    const params = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.callbackUrl,
      code,
    });

    // Usando o método base ou fetch direto conforme seu boilerplate
    const response = await fetch(`${this.TOKEN_URL}?${params.toString()}`);
    if (!response.ok)
      throw new Error(`Facebook token error: ${response.statusText}`);

    return await response.json();
  }

  private async fetchUserProfile(
    accessToken: string,
  ): Promise<FacebookUserProfileResponse> {
    // Importante solicitar explicitamente os campos que você quer usar
    const params = new URLSearchParams({
      fields: 'id,email,name,picture.type(large)',
      access_token: accessToken,
    });

    const response = await fetch(`${this.USER_INFO_URL}?${params.toString()}`);
    if (!response.ok)
      throw new Error(`Facebook profile error: ${response.statusText}`);

    return await response.json();
  }
}
