import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  BadRequestException,
  UseGuards,
  InternalServerErrorException,
  UnauthorizedException,
  Req,
} from "@nestjs/common";
import { OpenPhoneEventService } from "../service/open-phone-event.service";
import { AddressService } from "../service/address.service";
import { AuthGuard } from "../authguard/auth.guard";

@Controller("openPhoneEventData")
export class OpenPhoneEventController {
  constructor(
    private readonly openPhoneEventService: OpenPhoneEventService,
    private readonly addressService: AddressService
  ) {}

  @Post()
  async createOpenPhoneEvent(@Body() payload: any) {
    try {
      console.log("🚀 ~ OpenPhoneEventController ~ createOpenPhoneEvent ~ payload:", payload);

      // Check for empty or null payload
      if (!payload || Object.keys(payload).length === 0) {
        return { message: "Empty payload received", status: 200 };
      }

      // Proceed with creating the event
      const { openPhoneEvent, addressCreated } = await this.openPhoneEventService.create(payload);

      let responseMessage = "Open phone event data created successfully.";
      if (addressCreated) {
        responseMessage += " New address data created.";
      }

      return {
        message: responseMessage,
        openPhoneEventId: openPhoneEvent.id,
        addressCreated: addressCreated,
      };
    } catch (error) {
      console.error("Error in createOpenPhoneEvent:", error);
      throw new InternalServerErrorException("Failed to create open phone event");
    }
  }





  // @Post()
  // async createOpenPhoneEvent(
  //   @Body() payload: any,
  //   @Req() request: Request
  // ) {
  //   try {
  //     const signature = request.headers['openphone-signature'] as string | undefined;
  //     const isLocal = request.headers['is-local'] as string | undefined;
      
  //     const isLocalEnv = isLocal === 'true';
      
  //     if (!isLocalEnv && !signature) {
  //       throw new BadRequestException('Missing OpenPhone signature');
  //     }

  //     const { openPhoneEvent, addressCreated } = await this.openPhoneEventService.create(payload, signature || '', isLocalEnv);

  //     let responseMessage = "Open phone event data created successfully.";
  //     if (addressCreated) {
  //       responseMessage += " New address data created.";
  //     }

  //     return {
  //       message: responseMessage,
  //       openPhoneEventId: openPhoneEvent.id,
  //       addressCreated: addressCreated,
  //     };
  //   } catch (error) {
  //     console.error("Error in createOpenPhoneEvent:", error);
  //     if (error instanceof BadRequestException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException("Failed to create open phone event");
  //   }
  // }







  @Get("events")
  @UseGuards(AuthGuard)
  async getOpenPhoneEventsByAddress(@Query("address") address: string) {
    try {
      const openPhoneEvents =
        await this.openPhoneEventService.findOpenPhoneEventsByAddress(address);
      return {
        message: `OpenPhoneEvents found for address: ${address}`,
        data: openPhoneEvents,
      };
    } catch (error) {
      console.error("Error in getOpenPhoneEventsByAddress:", error);
      throw new InternalServerErrorException(
        "Failed to fetch open phone events"
      );
    }
  }

  @Get("events-by-address-and-from")
  @UseGuards(AuthGuard)
  async getEventBodiesByAddressAndFromNumber(
    @Query("address_id") addressId: number,
    @Query("from_number") fromNumber?: string
  ) {
    try {
      const addressIdNum = Number(addressId);
      if (isNaN(addressIdNum)) {
        throw new BadRequestException("Invalid address_id: must be a number.");
      }
      const eventBodies =
        await this.openPhoneEventService.findEventBodiesByAddressAndFromNumber(
          addressIdNum,
          fromNumber
        );

      return {
        message: `Event bodies fetched successfully for address_id: ${addressIdNum} and from: ${fromNumber || "all numbers"}`,
        data: eventBodies,
      };
    } catch (error) {
      console.error("Error in getEventBodiesByAddressAndFromNumber:", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to fetch event bodies");
    }
  }

  @Get("all")
  @UseGuards(AuthGuard)
  async getAllOpenPhoneEvent() {
    try {
      return this.openPhoneEventService.findAllOpenPhoneEvents();
    } catch (error) {
      console.error("Error in getAllOpenPhoneEvent:", error);
      throw new InternalServerErrorException(
        "Failed to fetch all open phone events"
      );
    }
  }

  @Get("getConversationsWithoutAddress")
  @UseGuards(AuthGuard)
  async getConversationsWithoutAddress() {
    try {
      const conversationIds =
        await this.openPhoneEventService.findConversationsWithoutAddress();
      return {
        message: "Conversations without address IDs fetched successfully.",
        data: conversationIds,
      };
    } catch (error) {
      console.error("Error in getConversationsWithoutAddress:", error);
      throw new InternalServerErrorException(
        "Failed to fetch conversations without address"
      );
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllOpenPhoneEvents(
    @Query("filter") filter?: "delivered" | "received"
  ) {
    try {
      const events = await this.openPhoneEventService.findAllFiltered(filter);
      return {
        message: "Open phone events fetched successfully",
        data: events,
      };
    } catch (error) {
      console.error("Error in getAllOpenPhoneEvents:", error);
      throw new InternalServerErrorException(
        "Failed to fetch filtered open phone events"
      );
    }
  }

  @Post("toggle-message-pin/:id")
  @UseGuards(AuthGuard)
  async toggleMessagePin(@Param("id") id: number) {
    try {
      const updatedEvent =
        await this.openPhoneEventService.toggleMessagePin(id);
      return updatedEvent;
    } catch (error) {
      console.error("Error in toggleMessagePin:", error);
      throw new InternalServerErrorException("Failed to toggle message pin");
    }
  }

  @Post("toggle-number-pin/:id")
  @UseGuards(AuthGuard)
  async toggleNumberPin(@Param("id") conversation_id: string) {
    try {
      const updatedEvent =
        await this.openPhoneEventService.toggleNumberPin(conversation_id);
      return updatedEvent;
    } catch (error) {
      console.error("Error in toggleNumberPin:", error);
      throw new InternalServerErrorException("Failed to toggle number pin");
    }
  }

  @Get("pinned-messages")
  @UseGuards(AuthGuard)
  async getPinnedMessages() {
    try {
      return this.openPhoneEventService.getAllPinnedMessages();
    } catch (error) {
      console.error("Error in getPinnedMessages:", error);
      throw new InternalServerErrorException("Failed to fetch pinned messages");
    }
  }

  @Get("pinned-numbers/:conversationId")
  @UseGuards(AuthGuard)
  async getPinnedNumbers(@Param("conversationId") conversationId: string) {
    try {
      return this.openPhoneEventService.getAllPinnedNumbers(conversationId);
    } catch (error) {
      console.error("Error in getPinnedNumbers:", error);
      throw new InternalServerErrorException("Failed to fetch pinned numbers");
    }
  }
}
