// import { Body, Controller, HttpCode, Post } from "@nestjs/common";
// import { OpenPhoneEventDto } from "src/dto/open-phone-event.dto";

// @Controller("")
// export class OpenPhoneEvent {
//     constructor(private readonly openPhoneEventService : OpenPhoneEventService){}

// @Post('/openPhoneEvent')
// @HttpCode(200)
//  postOpenPhoneEventData( @Body() dto:OpenPhoneEventDto){
//     return this.OpenPhoneEventService(dto)
//  }

// }



// import { Controller, Post, Get, Body } from '@nestjs/common';
// import { OpenPhoneEventService } from '../service/open-phone-event.service';
// import { OpenPhoneEventDto } from '../dto/open-phone-event.dto';

// @Controller('openPhoneEventData')
// export class OpenPhoneEventController {
//   constructor(private readonly openPhoneEventService: OpenPhoneEventService) {}

//   @Post()
//   async createOpenPhoneEvent(@Body() openPhoneEventDto: OpenPhoneEventDto) {
//     const createdEvent = await this.openPhoneEventService.create(openPhoneEventDto);
//     return {
//       message: 'Open phone event data created successfully',
//       id: createdEvent.id,
//     };
//   }
  
//   @Get()
//   async getAllOpenPhoneEvents() {
//     return this.openPhoneEventService.findAll();
//   }
// }


import { Controller, Post, Get, Body } from '@nestjs/common';
import { OpenPhoneEventService } from '../service/open-phone-event.service';
import { OpenPhoneEventDto } from '../dto/open-phone-event.dto';

@Controller('openPhoneEventData')
export class OpenPhoneEventController {
  constructor(private readonly openPhoneEventService: OpenPhoneEventService) {}

  @Post()
  async createOpenPhoneEvent(@Body() openPhoneEventDto: OpenPhoneEventDto) {
    const { openPhoneEvent, address, addressCreated } = await this.openPhoneEventService.create(openPhoneEventDto);
    
    let responseMessage = 'Open phone event data created successfully.';
    if (addressCreated) {
      responseMessage += ' New address data created.';
    } else {
      responseMessage += ' Existing address data used.';
    }

    return {
      message: responseMessage,
      openPhoneEventId: openPhoneEvent.id,
      addressId: address.id,
      addressCreated: addressCreated
    };
  }
  
  @Get()
  async getAllOpenPhoneEvents() {
    return this.openPhoneEventService.findAll();
  }
}