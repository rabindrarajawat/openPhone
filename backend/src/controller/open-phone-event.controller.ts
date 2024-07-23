import { Controller, Post, Get, Body, Query } from "@nestjs/common";
import { OpenPhoneEventService } from "../service/open-phone-event.service";
import { OpenPhoneEventDto } from "../dto/open-phone-event.dto";

@Controller("openPhoneEventData")
export class OpenPhoneEventController {
  constructor(private readonly openPhoneEventService: OpenPhoneEventService) {}

  @Post()
  async createOpenPhoneEvent(@Body() openPhoneEventDto: OpenPhoneEventDto) {
    const { openPhoneEvent, address, addressCreated } =
      await this.openPhoneEventService.create(openPhoneEventDto);

    let responseMessage = "Open phone event data created successfully.";
    if (addressCreated) {
      responseMessage += " New address data created.";
    } else {
      responseMessage += " Existing address data used.";
    }

    return {
      message: responseMessage,
      openPhoneEventId: openPhoneEvent.id,
      addressId: address.id,
      addressCreated: addressCreated,
    };
  }

  @Get()
  async getAllOpenPhoneEvents() {
    return this.openPhoneEventService.findAll();
  }

  // @Get("details")
  // async getAddressDetailsAndEvents(@Query("address") address: string) {
  //   const { addressDetails, openPhoneEvents } =
  //     await this.openPhoneEventService.findByAddress(address);

  //   return {
  //     addressDetails,
  //     openPhoneEvents,
  //   };
  // }

  @Get("events")
  async getOpenPhoneEventsByAddress(@Query("address") address: string) {
    const openPhoneEvents =
      await this.openPhoneEventService.findOpenPhoneEventsByAddress(address);
    return {
      message: `OpenPhoneEvents found for address: ${address}`,
      data: openPhoneEvents,
    };
  }
}
