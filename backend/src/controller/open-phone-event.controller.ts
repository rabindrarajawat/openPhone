import { Controller, Post, Get, Body, Query, NotFoundException } from "@nestjs/common";
import { OpenPhoneEventService } from "../service/open-phone-event.service";
import { OpenPhoneEventDto } from "../dto/open-phone-event.dto";
import { AddressService } from "src/service/address.service";

@Controller("openPhoneEventData")
export class OpenPhoneEventController {
  constructor(private readonly openPhoneEventService: OpenPhoneEventService,
    private readonly addressService: AddressService
  ) { }

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

  // @Get('search')
  // async searchAddresses(@Query('term') searchTerm: string) {
  //   if (!searchTerm || searchTerm.length < 2) {
  //     return { results: [] };
  //   }
  //   const addresses = await this.addressService.searchAddresses(searchTerm);
  //   return {
  //     results: addresses.map(address => ({
  //       id: address.id,
  //       fullAddress: address.address,
  //       name: address.name,
  //       // Add any other fields you want to return
  //     }))
  //   };
  // }

  @Get("getbody")
  async getBodyByConversationId(@Query("conversation_id") conversation_id: number) {
    try {
      const body = await this.openPhoneEventService.findBodyByConversationId(conversation_id);
      return { body };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }




}
