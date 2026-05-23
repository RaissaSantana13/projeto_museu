import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { MediaCategory } from '../../../commons/enum/media-type-enum';

@Injectable()
export class FotoService {
  // Define a raiz absoluta (Pode vir de uma variável de ambiente .env)
  // Exemplo Linux: '/mnt/storage/museum'
  // Exemplo Windows: 'C:/uploads/museum'
  private readonly diskRoot = path.resolve('/uploads_projeto_museu');
  constructor() {
    // Garante que as pastas existam ao iniciar o serviço
    if (!fs.existsSync(this.diskRoot)) {
      fs.mkdirSync(this.diskRoot, { recursive: true });
    }
  }

  async saveFiles(files: Express.Multer.File[], subfolder: string) {
    // Caminho absoluto da pasta de destino (Ex: /uploads_projeto_museu/pecas)
    const allowedFolders = Object.values(MediaCategory) as string[];
    if (!allowedFolders.includes(subfolder)) {
      throw new BadRequestException(
        `A categoria ${subfolder} não é permitida.`,
      );
    }
    const targetPath = path.join(this.diskRoot, subfolder);

    // Cria a estrutura de pastas se não existir na raiz do disco
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    const uploadPromises = files.map((file) =>
      this.processSingleFile(file, targetPath, subfolder),
    );
    return Promise.all(uploadPromises);
  }

  private async processSingleFile(
    file: Express.Multer.File,
    targetPath: string,
    subfolder: string,
  ) {
    const fileHash = uuidv4();
    const extension = this.getExtension(file);
    const fileName = `${fileHash}${extension}`;
    const thumbName = `${fileHash}-thumb${extension}`;

    // Caminhos absolutos para gravação no disco
    const fullDiskPath = path.join(targetPath, fileName);
    const thumbDiskPath = path.join(targetPath, thumbName);

    try {
      // 1. Grava original usando o caminho absoluto
      await fs.promises.writeFile(fullDiskPath, file.buffer);

      // 2. Gera Thumbnail usando o caminho absoluto
      await sharp(file.buffer)
        .resize(400, 400, { fit: 'cover' })
        .toFile(thumbDiskPath);

      // 3. Retorna os caminhos absolutos para salvar no banco
      return {
        originalName: file.originalname,
        absolutePath: fullDiskPath, // O que você quer gravar no banco
        absoluteThumbPath: thumbDiskPath,
        type: subfolder,
        mimeType: file.mimetype,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Erro ao gravar arquivo na raiz: ${file.originalname}`,
      );
    }
  }

  private getExtension(file: Express.Multer.File): string {
    const extFromName = path.extname(file.originalname);

    if (extFromName) {
      return extFromName.toLowerCase();
    }

    const mimeMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    };

    return mimeMap[file.mimetype] ?? '';
  }
}
