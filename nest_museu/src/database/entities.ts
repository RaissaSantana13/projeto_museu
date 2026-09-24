import { join } from 'path';

// Uma entidade por tabela. O glob amplo também carregava classes antigas duplicadas.
export const entityPaths = [
  'usuario/entities/usuario',
  'auth/entities/account',
  'auth/entities/credentials',
  'auth/entities/session',
  'access/entities/role',
  'access/entities/resources',
  'access/entities/permissions',
  'artwork/entities/artwork',
  'artwork-media/entities/artwork-media',
  'contact/entities/contact',
  'document/entities/document',
  'print/entities/print',
  'school/entities/school',
  'school/entities/school-representative',
  'school/entities/school-group',
  'school/entities/student',
  'school/entities/students-in-group',
  'event/entities/event',
  'event/entities/colaborators',
  'event/entities/eventbooking',
  'event/entities/eventbooking-group',
  'event/entities/visitors',
].map((file) => join(__dirname, '../module', `${file}.entity.{ts,js}`));
