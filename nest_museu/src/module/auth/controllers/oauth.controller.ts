import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ApiResponse } from '../../../commons/response/api.response';
import { ResponseBuilder } from '../../../commons/response/builder.response';
import { Public } from '../config/decorators/public.decorator';
import {
  OAuthAuthUrlRequest,
  OAuthCallbackRequest,
} from '../dto/request/oauth-callback.request';
import { OAuthAuthUrlResponse } from '../dto/response/oauth-callback.response';
import { OAuthProvider, OAuthService } from '../service/oauth.service';

/**
 * OAuth Controller
 * Handles OAuth authentication endpoints
 */
@ApiTags('oauth')
@Controller('auth/oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  /**
   * Get authorization URL for OAuth provider
   * GET /api/auth/oauth/authorize?provider=google
   */
  @Public()
  @Get('authorize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get OAuth authorization URL',
    description:
      'Returns the OAuth authorization URL for the specified provider (Google, Facebook). ' +
      'User will be redirected to this URL to authenticate with the OAuth provider.',
  })
  @ApiQuery({
    name: 'provider',
    required: true,
    description:
      'OAuth provider name (google, facebook, github). Only configured providers are available.',
    enum: ['google', 'facebook', 'github'],
    example: 'google',
  })
  getAuthorizationUrl(
    @Query() query: OAuthAuthUrlRequest,
  ): ApiResponse<OAuthAuthUrlResponse> {
    const url = this.oauthService.getAuthorizationUrl(query.provider);
    const response = { url, provider: query.provider };
    return ResponseBuilder.status<OAuthAuthUrlResponse>(HttpStatus.OK)
      .data(response)
      .build();
  }

  /**
   * Handle OAuth callback
   * POST /api/auth/oauth/callback
   */
  @Public()
  @Post('callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Handle OAuth callback',
    description:
      'Processes the OAuth callback from the provider after user authentication. ' +
      'Exchanges the authorization code for access tokens and creates/updates user account.',
  })
  @ApiBody({ type: OAuthCallbackRequest })
  async handleCallback(
    @Body() dto: OAuthCallbackRequest,
    @Res() response: Response,
  ) {
    const result = await this.oauthService.handleCallback(
      dto.provider,
      dto.code,
      dto.state || '',
      response,
    );
    return response.status(HttpStatus.OK).json(result);
  }

  /**
   * Get list of enabled OAuth providers
   * GET /api/auth/oauth/providers
   */
  @Public()
  @Get('providers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get enabled OAuth providers',
    description:
      'Returns a list of enabled OAuth providers for authentication. ' +
      'Only providers with complete configuration (clientId, clientSecret, callbackUrl) are enabled.',
  })
  getProviders(): ApiResponse<OAuthProvider[]> {
    const providers = this.oauthService.getSupportedProviders();
    return ResponseBuilder.status<OAuthProvider[]>(HttpStatus.OK)
      .data(providers)
      .build();
  }
}
