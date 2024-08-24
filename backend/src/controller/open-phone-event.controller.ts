

import { Controller, Post, Get, Body, Query, Param } from "@nestjs/common";
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
    console.log("🚀 ~ OpenPhoneEventController ~ createOpenPhoneEvent ~ payload:", payload)
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
  async getAllOpenPhoneEvents(@Query('filter') filter?: 'delivered' | 'received') {
    const events = await this.openPhoneEventService.findAllFiltered(filter);
    return {
      message: 'Open phone events fetched successfully',
      data: events,
    };
  }

  @Post('toggle-message-pin/:id')
  async toggleMessagePin(@Param('id') id: number) {
    const updatedEvent = await this.openPhoneEventService.toggleMessagePin(id);
    return updatedEvent
  }

  @Post('toggle-number-pin/:id')
  async toggleNumberPin(@Param('id') conversation_id: string) {
    const updatedEvent = await this.openPhoneEventService.toggleNumberPin(conversation_id);
    return updatedEvent
  }

  @Get('pinned-messages')
  async getPinnedMessages() {
    return this.openPhoneEventService.getAllPinnedMessages();
  }
  
  @Get('pinned-numbers/:conversationId')
  async getPinnedNumbers(@Param('conversationId') conversationId: string) {
    return this.openPhoneEventService.getAllPinnedNumbers(conversationId);
  }

}
