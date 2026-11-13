/**
 * OAuth Strategy Interface
 * Defines the contract for OAuth provider implementations
 */
export interface IOAuthStrategy {
  /**
   * Get the provider name (e.g., 'google', 'facebook')
   */
  readonly provider: string;

  /**
   * Check if this OAuth provider is enabled and configured
   */
  readonly isEnabled: boolean;

  /**
   * Get the authorization URL for the OAuth provider
   * @param state - Optional state parameter for CSRF protection
   * @returns Authorization URL
   */
  getAuthorizationUrl(state?: string): string;

  /**
   * Exchange authorization code for user profile
   * @param code - Authorization code from OAuth callback
   * @param state - Optional state parameter for CSRF protection
   * @returns User profile from OAuth provider
   */
  getAccountProfile(code: string, state?: string): Promise<OAuthAccountProfile>;
}

/**
 * OAuth User Profile Interface
 * Standardized user profile structure from OAuth providers
 */
export interface OAuthAccountProfile {
  idAccount?: string;
  usuarioId?: number;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  accountId?: string;
  providerId?: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: Date;
  // refreshTokenExpiresAt: Date;
  scope?: string;
  picture?: string;
  emailVerified?: boolean;
}

/**
 * OAuth Configuration Interface
 * Configuration required for OAuth providers
 */
export interface OAuthConfig {
  clientId: string;

  clientSecret: string;

  callbackUrl: string;

  scopes: string[];
}
