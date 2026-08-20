import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './controller/event.controller';

import { Event } from './entities/event.entity';
import { EventService } from './service/event.service';

import { EventBookingGroupController } from './controller/eventbooking-group.controller';
import { EventBookingGroup } from './entities/eventbooking-group.entity';
import { EventBooking } from './entities/eventbooking.entity';
import { Visitor } from './entities/visitors.entity';
import { EventBookingGroupService } from './service/eventbooking-group.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventBooking, EventBookingGroup, Visitor]),
  ],
  controllers: [EventController, EventBookingGroupController],
  providers: [EventService, EventBookingGroupService],
})
export class EventModule {}
