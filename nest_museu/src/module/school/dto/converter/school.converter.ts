import { plainToInstance } from 'class-transformer';
import { School } from '../../entities/school.entity';
import { SchoolRequest } from '../request/school.request';
import { SchoolResponse } from '../response/school.response';

export class SchoolConverter {
  /**
   * Converte um objeto de requisição (DTO) para a entidade School.
   */
  static toSchool(schoolRequest: SchoolRequest): School {
    return plainToInstance(School, schoolRequest);
  }

  /**
   * Converte a entidade School para um DTO de resposta.
   * O parâmetro excludeExtraneousValues garante que apenas campos com @Expose() sejam retornados.
   */
  static toSchoolResponse(school: School): SchoolResponse {
    return plainToInstance(SchoolResponse, school, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Converte uma lista de entidades School para uma lista de DTOs de resposta.
   */
  static toListSchoolResponse(listaSchool: School[]): SchoolResponse[] {
    return plainToInstance(SchoolResponse, listaSchool, {
      excludeExtraneousValues: true,
    });
  }
}
