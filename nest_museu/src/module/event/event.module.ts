import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './controller/event.controller';

import { Event } from './entities/event.entity';
import { EventService } from './service/event.service';

import { ColaboratorsController } from './controller/colaborators.controller';
import { EventBookingGroupController } from './controller/eventbooking-group.controller';
import { Colaborator } from './entities/colaborators.entity';
import { EventBookingGroup } from './entities/eventbooking-group.entity';
import { EventBooking } from './entities/eventbooking.entity';
import { Visitor } from './entities/visitors.entity';
import { ColaboratorsService } from './service/colaborators.service';
import { EventBookingGroupService } from './service/eventbooking-group.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      EventBooking,
      EventBookingGroup,
      Visitor,
      Colaborator,
    ]),
  ],
  controllers: [
    EventController,
    EventBookingGroupController,
    ColaboratorsController,
  ],
  providers: [EventService, EventBookingGroupService, ColaboratorsService],
})
export class EventModule {}
