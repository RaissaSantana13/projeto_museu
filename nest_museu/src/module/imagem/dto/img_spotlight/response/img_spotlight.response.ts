export class ImgSpotlightResponse {
  id_img_spotlight!: number;
  id_img!: number;
  start_date!: Date;
  end_date!: Date;

  // Esse construtor permite instanciar a classe já passando os valores
  constructor(partial?: Partial<ImgSpotlightResponse>) {
    Object.assign(this, partial);
  }
}