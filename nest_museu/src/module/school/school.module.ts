import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SchoolController } from "./controller/school.controller";
import { SchoolGroupController } from "./controller/school-group.controller";
import { StudentController } from "./controller/student.controller";
import { SchoolRepresentative } from "./entities/school-representative.entity";
import { School } from "./entities/school.entity";
import { Student } from "./entities/student.entity";
import { SchoolGroup } from "./entities/school-group.entity";
import { StudentsInGroup } from "./entities/students-in-group.entity";
import { SchoolService } from "./service/school.service";
import { SchoolGroupService } from "./service/school-group.service";
import { StudentService } from "./service/student.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      School,
      SchoolRepresentative,
      Student,
      SchoolGroup,
      StudentsInGroup,
    ]),
  ],
  controllers: [
    SchoolController,
    SchoolGroupController,
    StudentController,
  ],
  providers: [
    SchoolService,
    SchoolGroupService,
    StudentService,
  ],
  exports: [
    SchoolService,
    SchoolGroupService,
    StudentService,
  ],
})
export class SchoolModule {}
