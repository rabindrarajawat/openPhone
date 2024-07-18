


import { Controller, Post, Get, Body } from '@nestjs/common';
import { OpenPhoneEventService } from '../service/open-phone-event.service';
import { OpenPhoneEventDto } from '../dto/open-phone-event.dto';

@Controller('openPhoneEventData')
export class OpenPhoneEventController {
  constructor(private readonly openPhoneEventService: OpenPhoneEventService) {}

  @Post()
  async createOpenPhoneEvent(@Body() openPhoneEventDto: OpenPhoneEventDto) {
    const createdEvent = await this.openPhoneEventService.create(openPhoneEventDto);
    return {
      message: 'Open phone event data created successfully',
      id: createdEvent.id,
    };
  }
  
  @Get()
  async getAllOpenPhoneEvents() {
    return this.openPhoneEventService.findAll();
  }
}
