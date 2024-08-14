// import { Controller, Post, Get, Body, Query } from "@nestjs/common";
// import { OpenPhoneEventService } from "../service/open-phone-event.service";
// import { OpenPhoneEventDto } from "../dto/open-phone-event.dto";
// import { AddressService } from "src/service/address.service";

// @Controller("openPhoneEventData")
// export class OpenPhoneEventController {
//   constructor(
//     private readonly openPhoneEventService: OpenPhoneEventService,
//     private readonly addressService: AddressService
//   ) {}

//   @Post()
//   async createOpenPhoneEvent(@Body() openPhoneEventDto: OpenPhoneEventDto) {
//     const { openPhoneEvent, address, addressCreated } =
//       await this.openPhoneEventService.create(openPhoneEventDto);

//     let responseMessage = "Open phone event data created successfully.";
//     if (addressCreated) {
//       responseMessage += " New address data created.";
//     } else {
//       responseMessage += " Existing address data used.";
//     }

//     return {
//       message: responseMessage,
//       openPhoneEventId: openPhoneEvent.id,
//       addressId: address.id,
//       addressCreated: addressCreated,
//     };
//   }

//   @Get()
//   async getAllOpenPhoneEvents() {
//     return this.openPhoneEventService.findAll();
//   }

//   // @Get("details")
//   // async getAddressDetailsAndEvents(@Query("address") address: string) {
//   //   const { addressDetails, openPhoneEvents } =
//   //     await this.openPhoneEventService.findByAddress(address);

//   //   return {
//   //     addressDetails,
//   //     openPhoneEvents,
//   //   };
//   // }

// @Get("events")
// async getOpenPhoneEventsByAddress(@Query("address") address: string) {
//   const openPhoneEvents =
//     await this.openPhoneEventService.findOpenPhoneEventsByAddress(address);
//   return {
//     message: `OpenPhoneEvents found for address: ${address}`,
//     data: openPhoneEvents,
//   };
// }

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
// }

import { Controller, Post, Get, Body, Query } from "@nestjs/common";
import { OpenPhoneEventService } from "../service/open-phone-event.service";
import { AddressService } from "src/service/address.service";

@Controller("openPhoneEventData")
export class OpenPhoneEventController {
  constructor(
    private readonly openPhoneEventService: OpenPhoneEventService,
    private readonly addressService: AddressService
  ) {}
  @Post()
  async createOpenPhoneEvent(@Body() payload: any) {
    const { openPhoneEvent, addressCreated } =
      await this.openPhoneEventService.create(payload);

    let responseMessage = "Open phone event data created successfully.";
    if (addressCreated) {
      responseMessage += " New address data created.";
    }
    // else {
    //   responseMessage += "";
    // }

    return {
      message: responseMessage,
      openPhoneEventId: openPhoneEvent.id,
      // addressId: address.id,
      addressCreated: addressCreated,
    };
  }

  @Get("events")
  async getOpenPhoneEventsByAddress(@Query("address") address: string) {
    const openPhoneEvents =
      await this.openPhoneEventService.findOpenPhoneEventsByAddress(address);
    return {
      message: `OpenPhoneEvents found for address: ${address}`,
      data: openPhoneEvents,
    };
  }

  @Get("events-by-address-and-from")
  async getEventBodiesByAddressAndFromNumber(
    @Query("address_id") addressId: number,
    @Query("from_number") fromNumber?: string
  ) {
    // console.log('Received from_number:', fromNumber); // Check if the fromNumber is correctly decoded

    const eventBodies =
      await this.openPhoneEventService.findEventBodiesByAddressAndFromNumber(
        addressId,
        fromNumber
      );
    return {
      message: `Event bodies fetched successfully for address_id: ${addressId} and from: ${fromNumber || "all numbers"}`,
      data: eventBodies,
    };
  }

  @Get("all")
  async getAllOpenPhoneEvent() {
    return this.openPhoneEventService.findAllOpenPhoneEvents();
  }

  @Get("getConversationsWithoutAddress")
  async getConversationsWithoutAddress() {
    const conversationIds =
      await this.openPhoneEventService.findConversationsWithoutAddress();
    return {
      message: "Conversations without address IDs fetched successfully.",
      data: conversationIds,
    };
  }

  @Get()
  async getAllOpenPhoneEvents() {
    return this.openPhoneEventService.findAll();
  }
}
