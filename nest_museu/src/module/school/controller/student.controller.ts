import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../../auth/config/guards/jwt-authentication.guard';
import { StudentService } from '../service/student.service';
import { CreateStudentRequest, UpdateStudentRequest } from '../dto/request/student.request';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthenticationGuard)
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(@Body() dto: CreateStudentRequest) {
    return this.studentService.create(dto);
  }

  @Get()
  async findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.studentService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateStudentRequest) {
    return this.studentService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.studentService.remove(+id);
  }
}