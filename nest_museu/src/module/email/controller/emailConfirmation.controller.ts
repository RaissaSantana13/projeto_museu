import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtAuthenticationGuard from '../../auth/config/guards/jwt-authentication.guard';
import RequestWithUser from '../../auth/config/requestWithUser.interface';
import { ConfirmEmailResponse } from '../dto/confirm-email-response';

@Controller('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor() {
    //private readonly emailConfirmationService: EmailConfirmationService,
  }

  @Post('confirm')
  async confirm(@Body() confirmationData: ConfirmEmailResponse) {
    // const email = await this.emailConfirmationService.decodeConfirmationToken(
    //   confirmationData.token,
    // );
    // await this.emailConfirmationService.confirmEmail(email);
  }

  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthenticationGuard)
  async resendConfirmationLink(@Req() request: RequestWithUser) {
    // await this.emailConfirmationService.resendConfirmationLink(
    //   request.user.idUsuario,
    // );
  }
}
