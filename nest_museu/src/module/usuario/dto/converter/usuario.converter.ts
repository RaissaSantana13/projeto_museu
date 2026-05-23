import { plainToInstance } from 'class-transformer';
import { Usuario } from '../../entities/usuario.entity';
import { UsuarioRequest } from '../request/usuario.request';
import { UsuarioResponse } from '../response/usuario.response';

export class UsuarioConverter {
  static toUsuario(usuarioRequest: UsuarioRequest): Usuario {
    return plainToInstance(Usuario, usuarioRequest);
  }

  static toUsuarioResponse(usuario: Usuario): UsuarioResponse {
    return plainToInstance(UsuarioResponse, usuario, {
      excludeExtraneousValues: true, // tem a função de ignorar as propriedades não marcadas com @Expose()
    });
  }

  static toListUsuarioResponse(listaUsuario: Usuario[]): UsuarioResponse[] {
    return plainToInstance(UsuarioResponse, listaUsuario, {
      excludeExtraneousValues: true,
    });
  }
}
