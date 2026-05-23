import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseOAuthStrategy } from './base-oauth.strategy';
import { OAuthAccountProfile } from './oauth.strategy.interface';

/**
 * GitHub Token Response
 */
interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

/**
 * GitHub User Profile Response
 */
interface GitHubUserProfileResponse {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

/**
 * GitHub Email Response
 */
interface GitHubEmailResponse {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

@Injectable()
export class GitHubOAuthStrategy extends BaseOAuthStrategy {
  private readonly AUTH_URL = 'https://github.com/login/oauth/authorize';
  private readonly TOKEN_URL = 'https://github.com/login/oauth/access_token';
  private readonly USER_INFO_URL = 'https://api.github.com/user';
  private readonly USER_EMAILS_URL = 'https://api.github.com/user/emails';

  constructor(configService: ConfigService) {
    super(configService, 'github');
  }

  protected getScopes(): string[] {
    return ['user:email', 'read:user'];
  }

  getAuthorizationUrl(state?: string): string {
    const config = this.ensureEnabled();
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.callbackUrl,
      scope: config.scopes.join(' '),
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
      // 1. Troca o código pelo token
      const tokenResponse = await this.exchangeCodeForToken(code);
      this.logger.log('Successfully obtained access token for GitHub OAuth');
      const userProfile = await this.httpGet<GitHubUserProfileResponse>(
        this.USER_INFO_URL,
        {
          Authorization: `Bearer ${tokenResponse.access_token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Museu-Virtual-App',
        },
      );

      // 3. Busca o e-mail verificado (essencial para a tabela credentials)
      const email = await this.getPrimaryVerifiedEmail(
        tokenResponse.access_token,
      );

      if (!email) {
        throw new Error('No verified email found on GitHub account');
      }

      // 4. Tratamento de nome para a tabela 'usuario'
      const displayName = userProfile.name || userProfile.login;
      const names = displayName.split(' ');

      return {
        // Dados para 'usuario' e 'credentials'
        email: email,
        name: displayName,
        firstName: names[0],
        lastName: names.slice(1).join(' ') || ' ',
        picture: userProfile.avatar_url,
        emailVerified: true,

        // Dados para a tabela 'account' (Postgres)
        providerId: userProfile.id,
        accessToken: tokenResponse.access_token,
        //refreshToken: "", // GitHub não envia refresh_token no fluxo padrão Web
        //accessTokenExpiresAt: null, // Tokens de usuário do GitHub geralmente não expiram a menos que revogados
        //refreshTokenExpiresAt: null,
        scope: tokenResponse.scope,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get GitHub user profile: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  private async exchangeCodeForToken(
    code: string,
  ): Promise<GitHubTokenResponse> {
    const config = this.ensureEnabled();
    const response = await fetch(this.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Token exchange failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const data = (await response.json()) as GitHubTokenResponse & {
      error?: string;
      error_description?: string;
    };
    if (data.error) {
      throw new Error(
        `GitHub OAuth error: ${data.error} - ${data.error_description || 'Unknown error'}`,
      );
    }
    return data;
  }

  private async getPrimaryVerifiedEmail(
    accessToken: string,
  ): Promise<string | null> {
    try {
      const emails = await this.httpGet<GitHubEmailResponse[]>(
        this.USER_EMAILS_URL,
        {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'NestJS-Auth-App',
        },
      );
      const primaryEmail = emails.find((e) => e.primary && e.verified);
      if (primaryEmail) {
        return primaryEmail.email;
      }
      const verifiedEmail = emails.find((e) => e.verified);
      return verifiedEmail?.email ?? null;
    } catch (error) {
      this.logger.error(
        `Failed to get GitHub emails: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }
}
