import {
  BadRequestException,
  Controller,
  Get,
  Header,
  HttpCode,
  Put,
  Req,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtAuthenticationGuard from '../config/guards/jwt-authentication.guard';
import RequestWithUser from '../config/requestWithUser.interface';
import { AUTH } from '../constants/login.constants';
import {
  PROFILE_AVATAR_MAX_BYTES,
  ProfileAvatarService,
} from '../service/profile-avatar.service';

@Controller(AUTH.ENTITY)
@UseGuards(JwtAuthenticationGuard)
export class ProfileAvatarController {
  constructor(private readonly avatars: ProfileAvatarService) {}

  @Get(`${AUTH.ROTAS.SESSION_ME}/avatar`)
  @Header('Cache-Control', 'private, no-store')
  async read(@Req() req: RequestWithUser) {
    const image = await this.avatars.read(req.user.idUsuario);
    return new StreamableFile(image, { type: 'image/jpeg' });
  }

  @Put(`${AUTH.ROTAS.SESSION_ME}/avatar`)
  @HttpCode(204)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: PROFILE_AVATAR_MAX_BYTES, files: 1, fields: 0 },
    }),
  )
  async save(
    @Req() req: RequestWithUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file?.buffer.length) throw new BadRequestException('Envie uma imagem.');
    await this.avatars.save(req.user.idUsuario, file.buffer);
  }
}
