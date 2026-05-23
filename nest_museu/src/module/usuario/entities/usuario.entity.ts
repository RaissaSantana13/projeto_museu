import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { Roles } from '../../access/entities/role.entity';
import { Account } from '../../auth/entities/account.entity';
import { Credentials } from '../../auth/entities/credentials.entity';
import { Session } from '../../auth/entities/session.entity';
import { USUARIO } from '../constants/usuario.constantes';

@Entity(USUARIO.ENTITY)
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn({ name: USUARIO.TABLE_FIELDS.ID_USUARIO })
  idUsuario!: number;

  @Column({ name: USUARIO.TABLE_FIELDS.FIRSTNAME, length: 100 })
  firstName!: string;

  @Column({ name: USUARIO.TABLE_FIELDS.LASTNAME, length: 100 })
  lastName!: string;

  @Column({ name: USUARIO.TABLE_FIELDS.USERNAME, length: 100 })
  username!: string;

  @Column({
    name: USUARIO.TABLE_FIELDS.EMAIL_VERIFIED,
    default: false,
  })
  emailVerified!: boolean;

  @Column({ name: USUARIO.TABLE_FIELDS.ACTIVE, default: false })
  active: boolean = false;

  // Caminho da foto processada pelo serviço de upload que criamos
  @Column({
    name: USUARIO.TABLE_FIELDS.IMAGE_PATH,
    length: 255,
    nullable: true,
  })
  imagePath!: string;

  // Relações
  @OneToMany(() => Session, (session) => session.usuario)
  sessions!: Session[];

  @OneToMany(() => Account, (account) => account.usuario)
  accounts!: Account[];

  @OneToOne(() => Credentials, (cred: Credentials) => cred.usuario, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  credentials!: Credentials;

  @ManyToMany(() => Roles, (roles) => roles.usuario, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'USUARIO_ROLES', // Nome da tabela de junção criada no SQL
    joinColumn: { name: 'USUARIO_ID', referencedColumnName: 'idUsuario' },
    inverseJoinColumn: { name: 'ROLE_ID', referencedColumnName: 'idRoles' },
  })
  role!: Roles[];

  @Column({ name: 'twofactorauthenticationsecret', nullable: true })
  twoFactorAuthenticationSecret?: string;

  @Column({ name: 'istwofactorauthenticationenabled', default: false })
  isTwoFactorAuthenticationEnabled!: boolean;

  @Column({ name: 'currenthashedrefreshtoken', nullable: true })
  currentHashedRefreshToken?: string;

  @Column({ type: 'text', nullable: true })
  mfaCode!: string;

  @Column({ type: 'timestamp', nullable: true })
  mfaExpiresAt!: Date;

  constructor(data: Partial<Usuario> = {}) {
    super();
    Object.assign(this, data);
  }
}

/* 
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nome_usuario VARCHAR(100) NOT NULL,
    email_usuario VARCHAR(100) NOT NULL UNIQUE,
    senha_usuario VARCHAR(100), -- nullable conforme sua entidade
    emailVerified BOOLEAN DEFAULT FALSE,
    ativo_usuario BOOLEAN DEFAULT FALSE,
    image_usuario VARCHAR(255),
    twoFactorAuthenticationSecret VARCHAR(255),
    isTwoFactorAuthenticationEnabled BOOLEAN DEFAULT FALSE,
    currentHashedRefreshToken VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
)

@Entity('usuario')
export class Usuario {

  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  idUsuario: number;

  @Column({ name: 'nome_usuario', length: 150 })
  nomeUsuario: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ length: 255 })
  senha: string;

  @Column({ default: false })
  ativo: boolean;
}

npm install @nestjs/typeorm typeorm mysql2

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario/usuario.entity';
import { TABELA_USUARIO } from '../service/tabela.usuario';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'senha',
      database: 'meubanco',
      entities: [Usuario],
	      
      synchronize: true,
    }),

    TypeOrmModule.forFeature([Usuario]),
  ],
})
export class AppModule {}
 */
