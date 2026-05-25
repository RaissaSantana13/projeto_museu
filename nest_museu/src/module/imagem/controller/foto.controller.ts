import {
  Controller,
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ApiResponse } from '../../../commons/response/api.response';
import { ResponseBuilder } from '../../../commons/response/builder.response';
import { USUARIO } from '../../usuario/constants/usuario.constants';
import { FOTO } from '../constants/foto.constants';
import { FotoService } from '../service/foto.service';

@Controller(FOTO.ROTAS.BASE)
export class FotoSingleFileController {
  constructor(private readonly fotoService: FotoService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image')) // 'image' é o nome do campo no FormData
  async uploadSinglePhoto(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 1. Validar tamanho (ex: 5MB = 5 * 1024 * 1024)
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          // 2. Validar tipo (Regex para aceitar jpeg, png, webp)
          new FileTypeValidator({ fileType: 'image/(jpeg|jpg|png|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Query('type') type: string = USUARIO.ENTITY, // 'usuarios', 'pecas', 'eventos'
    @Req() req: Request,
  ): Promise<ApiResponse<any>> {
    // Retorna a lista de caminhos para serem gravados no banco de dados
    const result = await this.fotoService.saveFiles([file], type);

    // 2. Monta a resposta usando o seu ResponseBuilder
    return ResponseBuilder.status<any>(HttpStatus.CREATED)
      .message(FOTO.MENSAGEM.ENTIDADE_CADASTRADA)
      .data(result[0]) // Aqui vão os caminhos e thumbnails gerados
      .path(req.url)
      .metodo(req.method)
      .build();
  }
}
