import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "../../../commons/entities/base.entity";
import { School } from "./school.entity";
import { Usuario } from "../../usuario/entities/usuario.entity";

@Entity("school_representatives")
export class SchoolRepresentative extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id_representative" })
  idRepresentative!: number;

  // Relacionamento com a escola (id_school)
  @ManyToOne(() => School, (school) => school.representatives, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id_school" })
  school!: School;

  // Relacionamento com o usuário do sistema (id_user)
  @ManyToOne(() => Usuario, { onDelete: "CASCADE" })
  @JoinColumn({ name: "id_user" })
  usuario!: Usuario;

  constructor(data: Partial<SchoolRepresentative> = {}) {
    super();
    Object.assign(this, data);
  }
}