//import { Image } from './image.entity'; // Confirme se o caminho está correto no seu projeto

export class ImgSpotlight {
  id_img_spotlight?: number; // Opcional (?) porque o banco gera automático
  id_img!: number;
  start_date!: Date;
  end_date!: Date;
  
  //image?: Image; // O relacionamento com a tabela principal

  constructor(partial?: Partial<ImgSpotlight>) {
    Object.assign(this, partial);
  }
}