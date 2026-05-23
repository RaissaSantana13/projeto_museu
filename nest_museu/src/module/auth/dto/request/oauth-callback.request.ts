import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OAuthProvider } from '../../service/oauth.service';

/**
 * OAuth Callback DTO
 * Used to handle OAuth callback requests
 */
export class OAuthCallbackRequest {
  @ApiProperty({
    description: 'OAuth provider name',
    enum: ['google', 'facebook', 'github'],
    example: 'google',
  })
  @IsEnum(['google', 'facebook', 'github'], {
    message: 'Provider must be google, facebook, or github',
  })
  @IsNotEmpty()
  provider!: OAuthProvider;

  @ApiProperty({
    description: 'OAuth authorization code from provider',
    example: '4/0AX4XhW7ly5Cx...',
  })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({
    description: 'OAuth state parameter for CSRF protection',
    example: 'random_state_string',
    required: false,
  })
  @IsString()
  state?: string;
}

/**
 * OAuth Authorization URL Response DTO
 */

/**
 * OAuth Authorization URL Request DTO
 */
export class OAuthAuthUrlRequest {
  @ApiProperty({
    description: 'OAuth provider name',
    enum: ['google', 'facebook', 'github'],
    example: 'google',
  })
  @IsEnum(['google', 'facebook', 'github'], {
    message: 'Provider must be google, facebook, or github',
  })
  @IsNotEmpty()
  provider!: OAuthProvider;
}
