import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsController } from './controller/permissions.controller';
import { ResourcesController } from './controller/resources.controller';
import { RolesController } from './controller/roles.controller';
import { Permissions } from './entities/permissions.entity';
import { Resources } from './entities/resources.entity';
import { Roles } from './entities/role.entity';
import { PermissionsService } from './service/permissions.service';
import { ResourcesSeedService } from './service/resources.seed.service';
import { ResourcesService } from './service/resources.service';
import { RolesSeedService } from './service/roles.seed.service';
import { RolesService } from './service/roles.service';

const moduleController = [
  RolesController,
  ResourcesController,
  PermissionsController,
];
const moduleProviders = [
  RolesService,
  ResourcesService,
  PermissionsService,
  ResourcesSeedService,
  RolesSeedService,
];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Roles, Resources, Permissions])],
  providers: [...moduleProviders],
  controllers: [...moduleController],
  exports: [],
})
export class AcessoModule {}
