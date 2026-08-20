import { ImgSpotlightEntity } from '../../../entities/img_spotlight.entity';
import { CreateImgSpotlightRequest } from '../request/create_img_spotlight.request';
import { ImgSpotlightResponse } from '../response/img_spotlight.response';

export class ImgSpotlightConverter {
  // Transforma o que vem da web para o formato do Banco de Dados
  public static toEntity(request: CreateImgSpotlightRequest): ImgSpotlightEntity {
    const entity = new ImgSpotlightEntity();
    entity.id_img = request.id_img;
    entity.start_date = request.start_date;
    entity.end_date = request.end_date;
    return entity;
  }

  // Transforma o que vem do Banco de Dados para o formato da Web
  public static toResponse(entity: ImgSpotlightEntity): ImgSpotlightResponse {
    const response = new ImgSpotlightResponse();
    response.id_img_spotlight = entity.id_img_spotlight!;
    response.id_img = entity.id_img;
    response.start_date = entity.start_date;
    response.end_date = entity.end_date;
    return response;
  }
}