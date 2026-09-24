import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Request } from 'express';
import { GenericConverter } from '../../../commons/converter/converter.commons';
import { ApiResponse } from '../../../commons/response/api.response';
import { ResponseBuilder } from '../../../commons/response/builder.response';
import { USUARIO } from '../../usuario/constants/usuario.constants';
import { UsuarioResponse } from '../../usuario/dto/response/usuario.response';
import { UsuarioService } from '../../usuario/service/usuario.service';
import JwtAuthenticationGuard from '../config/guards/jwt-authentication.guard';
import JwtRefreshGuard from '../config/guards/jwt-refresh.guard';
import { LocalAuthenticationGuard } from '../config/guards/localAuthentication.guard';
import RequestWithUser from '../config/requestWithUser.interface';
import { AUTH } from '../constants/login.constants';
import { ChangePasswordRequest } from '../dto/request/change.password.request';
import { ForgotPasswordRequest } from '../dto/request/forgot.password.request';
import { RegisterUsuarioRequest } from '../dto/request/register.usuario.request';
import { ResetPasswordRequest } from '../dto/request/reset.password.request';
import { LoginResponse } from '../dto/response/login.response';
import { AuthenticationService } from '../service/authentication.service';
import { SessionService } from '../service/session.service';
import { ConfirmEmailRequest } from '../dto/request/confirm-email.request';
import { LoginRequest } from '../dto/request/login.request';
import { ApiBody } from '@nestjs/swagger';

@Controller(AUTH.ENTITY)
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usuarioService: UsuarioService,
    private readonly sessionService: SessionService,
    //private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthenticationGuard)
  @Post(AUTH.ROTAS.SESSION)
  @ApiBody({ type: LoginRequest })
  async logIn(
    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<LoginResponse>> {
    const usuario = req.user;
    const { cookie: accessTokenCookie } =
      this.authenticationService.getCookieWithJwtAccessToken(usuario.idUsuario);
    const {
      cookie: refreshTokenCookie,
      token: refreshToken,
      expiresRefreshToken,
    } = this.authenticationService.getCookieWithJwtRefreshToken(
      usuario.idUsuario,
    );

    await this.usuarioService.setCurrentRefreshToken(
      refreshToken,
      usuario.idUsuario,
    );

    req.res?.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    const session = {
      idUsuario: usuario.idUsuario,
      token: refreshToken,
      ipAddress: req.ip ?? '0.0.0.0',
      userAgent: String(req.headers['user-agent'] ?? 'unknown'),
      expiresAt: expiresRefreshToken,
    };

    await this.sessionService.salvar(session);
    const response = GenericConverter.toResponse(LoginResponse, {
      idUsuario: req.user.idUsuario,
      username: req.user.username,
      email: req.user.credentials?.email,
    });
    return ResponseBuilder.status<LoginResponse>(HttpStatus.OK)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .build();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(AUTH.ROTAS.SESSION)
  @HttpCode(HttpStatus.OK)
  async logOut(@Req() request: RequestWithUser) {
    await this.usuarioService.removeRefreshToken(request.user.idUsuario);
    request.res?.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookiesForLogOut(),
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(AUTH.ROTAS.SESSION_ME)
  usuarioAuthenticate(@Req() req: RequestWithUser) {
    const response = GenericConverter.toResponse(LoginResponse, {
      idUsuario: req.user.idUsuario,
      username: req.user.username,
      email: req.user.credentials?.email,
    });

    return ResponseBuilder.status<LoginResponse>(HttpStatus.OK)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .build();
  }

  @UseGuards(JwtRefreshGuard)
  @Put(AUTH.ROTAS.SESSION)
  refresh(@Req() req: RequestWithUser) {
    const { cookie: accessTokenCookie } =
      this.authenticationService.getCookieWithJwtAccessToken(
        req.user.idUsuario,
      );

    req.res?.setHeader('Set-Cookie', accessTokenCookie);

    const response = GenericConverter.toResponse(LoginResponse, {
      idUsuario: req.user.idUsuario,
      username: req.user.username,
      email: req.user.credentials?.email,
    });

    return ResponseBuilder.status<LoginResponse>(HttpStatus.OK)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .build();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Put(AUTH.ROTAS.SESSION_CHANGE_PASSWORDS)
  async changePassword(
    @Body() changePassordRequest: ChangePasswordRequest,
    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<void>> {
    const message = await this.authenticationService.changePassword(
      req.user.idUsuario,
      changePassordRequest.password,
      changePassordRequest.confirmPassword,
    );
    return ResponseBuilder.status<void>(HttpStatus.OK).message(message).build();
  }

  async forgotPassword(@Body() forgotPasswordRequest: ForgotPasswordRequest) {
    return this.authenticationService.forgotPassword(
      forgotPasswordRequest.email,
    );
  }

  @Put(AUTH.ROTAS.SESSION_PASSWORD_RESETS)
  async resetPassword(
    @Body() resetPasswordRequest: ResetPasswordRequest,
  ): Promise<ApiResponse<void> | undefined> {
    const message = await this.authenticationService.resetPassword(
      resetPasswordRequest.password,
      resetPasswordRequest.token,
    );
    if (!message) return;
    return ResponseBuilder.status<void>(HttpStatus.OK).message(message).build();
  }

  @Post(AUTH.ROTAS.REGISTER)
  async registerUsuarioRequest(
    @Body() registerUsuarioRequest: RegisterUsuarioRequest,
    @Req() req: Request,
  ): Promise<ApiResponse<UsuarioResponse>> {
    const response = await this.usuarioService.registrarUsuario(
      registerUsuarioRequest,
    );
    return ResponseBuilder.status<UsuarioResponse>(HttpStatus.OK)
      .message(USUARIO.MENSAGEM.ENTIDADE_CADASTRADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .build();
  }

  @Post(AUTH.ROTAS.CONFIRM_EMAIL)
  async verificationEmail(@Body() dto: ConfirmEmailRequest): Promise<void> {
    await this.usuarioService.markEmailAsConfirmed(dto.token);
  }
}
