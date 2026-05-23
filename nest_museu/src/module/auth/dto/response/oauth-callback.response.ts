import { ApiProperty } from '@nestjsx/crud/lib/crud';

export class OAuthAuthUrlResponse {
  @ApiProperty({
    description: 'OAuth authorization URL',
    example: 'https://accounts.google.com/o/oauth2/v2/auth?...',
  })
  url!: string;

  @ApiProperty({
    description: 'OAuth provider name',
    example: 'google',
  })
  provider!: string;
}
