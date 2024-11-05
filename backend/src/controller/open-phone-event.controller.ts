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
import { CustomLogger } from "src/service/logger.service";

@Controller("openPhoneEventData")
export class OpenPhoneEventController {
  constructor(
    private readonly openPhoneEventService: OpenPhoneEventService,
    private readonly addressService: AddressService,
    private readonly logger:CustomLogger,
  ) {}

  @Post()
  async createOpenPhoneEvent(@Body() payload: any) {
    try {
      console.log(
        "🚀 ~ OpenPhoneEventController ~ createOpenPhoneEvent ~ payload:",
        payload
      );
      this.logger.log(`Open phone event data created: ${JSON.stringify(payload)}`);

      // Check for empty or null payload
      if (!payload || Object.keys(payload).length === 0) {
        return { message: "Empty payload received", status: 200 };
      }

      // Proceed with creating the event
      const { openPhoneEvent, addressCreated } =
        await this.openPhoneEventService.create(payload);

      // If no entry was created in openPhoneEvent
      if (!openPhoneEvent || !openPhoneEvent.id) {
        return { message: "Empty payload received", status: 200 };
      }

      let responseMessage = "Open phone event data created successfully.";
      if (addressCreated) {
        responseMessage += " New address data created.";
      }

      return {
        message: responseMessage,
        openPhoneEventId: openPhoneEvent?.id,
        addressCreated: addressCreated,
      };
    } catch (error) {
      console.error("Error in createOpenPhoneEvent:", error);
      throw new InternalServerErrorException(
        "Failed to create open phone event"
      );
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
      this.logger.log(`Fetching OpenPhoneEvents for address: ${address}`);

      const openPhoneEvents =
        await this.openPhoneEventService.findOpenPhoneEventsByAddress(address);
        this.logger.log(`OpenPhoneEvents successfully retrieved for address: ${address}. Data: ${JSON.stringify(openPhoneEvents)}`);

      return {
        message: `OpenPhoneEvents found for address: ${address}`,
        data: openPhoneEvents,
      };
    } catch (error) {
      this.logger.error(`Error fetching OpenPhoneEvents for address: ${address}`, error.stack);

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
      this.logger.log(`Request received for address_id: ${addressId}, from_number: ${fromNumber || 'all numbers'}`);

      const addressIdNum = Number(addressId);
      if (isNaN(addressIdNum)) {
        this.logger.warn(`Invalid address_id provided: ${addressId}`);

        throw new BadRequestException("Invalid address_id: must be a number.");
      }
      const eventBodies =
        await this.openPhoneEventService.findEventBodiesByAddressAndFromNumber(
          addressIdNum,
          fromNumber
        );
        this.logger.log(`Event bodies successfully fetched for address_id: ${addressIdNum} and from: ${fromNumber || 'all numbers'}`);
        this.logger.log(`Response data: ${JSON.stringify(eventBodies)}`);

      return {
        message: `Event bodies fetched successfully for address_id: ${addressIdNum} and from: ${fromNumber || "all numbers"}`,
        data: eventBodies,
      };
    } catch (error) {
      console.error("Error in getEventBodiesByAddressAndFromNumber:", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error in getEventBodiesByAddressAndFromNumber: ${error.message}`);

      throw new InternalServerErrorException("Failed to fetch event bodies");
    }
  }

  @Get('all')
  @UseGuards(AuthGuard)
  async getAllOpenPhoneEvent() {
    try {
      this.logger.log('Request received to fetch all open phone events.');

      const openPhoneEvents = await this.openPhoneEventService.findAllOpenPhoneEvents();
      
      this.logger.log(`Response data: ${JSON.stringify(openPhoneEvents)}`);
      this.logger.log('Successfully fetched all open phone events.');
      
      return openPhoneEvents;
    } catch (error) {
      this.logger.error(`Error in getAllOpenPhoneEvent: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch all open phone events');
    }
  }


  // @Get("getConversationsWithoutAddress")
  // @UseGuards(AuthGuard)
  // async getConversationsWithoutAddress() {
  //   try {
  //     const conversationIds =
  //       await this.openPhoneEventService.findConversationsWithoutAddress();
  //     return {
  //       message: "Conversations without address IDs fetched successfully.",
  //       data: conversationIds,
  //     };
  //   } catch (error) {
  //     console.error("Error in getConversationsWithoutAddress:", error);
  //     throw new InternalServerErrorException(
  //       "Failed to fetch conversations without address"
  //     );
  //   }
  // }

@Get("getConversationsWithoutAddress")
  @UseGuards(AuthGuard)
  async getConversationsWithoutAddress(
    @Query("limit") limit: number = 10,  // Default to 10 if not provided
    @Query("page") page: number = 1       // Default to page 1 if not provided
  ) {
    try {
      this.logger.log(`Fetching conversations without address IDs, page: ${page}, limit: ${limit}`);

      // Call the service method with pagination parameters
      const { data, totalCount, totalPages, currentPage } =
        await this.openPhoneEventService.findConversationsWithoutAddress(page,limit);
  
        const response = {

          
            message: "Conversations without address IDs fetched successfully.",
            data,
            totalCount,  // Total number of conversations without address
            totalPages,  // Total pages based on limit and totalCount
            currentPage, // The current page being viewed
          
        }
        this.logger.log(`Response: ${JSON.stringify(response)}`);
        this.logger.log('Successfully fetched conversations without address IDs.');

        return response;

    } catch (error) {
      this.logger.error(`Error in getConversationsWithoutAddress: ${error.message}`);

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
      this.logger.log(`Fetching open phone events with filter: ${filter || 'none'}`);

      const events = await this.openPhoneEventService.findAllFiltered(filter);
      const response = {
        message: "Open phone events fetched successfully",
        data: events,
      };

      this.logger.log(`Response: ${JSON.stringify(response)}`);
      this.logger.log('Successfully fetched open phone events.');

      return response;

    } catch (error) {
      this.logger.error(`Error in getAllOpenPhoneEvents: ${error.message}`);

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
      this.logger.log(`Toggling message pin for event ID: ${id}`);
      
      const updatedEvent = await this.openPhoneEventService.toggleMessagePin(id);

      this.logger.log(`Message pin toggled successfully for event ID: ${id}`);
      this.logger.log(`Response: ${JSON.stringify(updatedEvent)}`);

      return updatedEvent;
    } catch (error) {
      this.logger.error(`Error in toggleMessagePin for event ID: ${id}, Error: ${error.message}`);
      console.error("Error in toggleMessagePin:", error); // Original error log
      throw new InternalServerErrorException("Failed to toggle message pin");
    }
  }



  @Get("pinned-messages")
  @UseGuards(AuthGuard)
  async getPinnedMessages() {
    try {
      this.logger.log("Fetching all pinned messages");

      const pinnedMessages = await this.openPhoneEventService.getAllPinnedMessages();

      this.logger.log("Pinned messages fetched successfully");
      this.logger.log(`Response: ${JSON.stringify(pinnedMessages)}`);

      return {
        message: "Pinned messages fetched successfully",
        data: pinnedMessages,
      };
    } catch (error) {
      this.logger.error("Error in getPinnedMessages:", error.message);

      console.error("Error in getPinnedMessages:", error);
      throw new InternalServerErrorException("Failed to fetch pinned messages");
    }
  }

  @Get("pinned-numbers/:conversationId")
  @UseGuards(AuthGuard)
  async getPinnedNumbers(@Param("conversationId") conversationId: string) {
    try {
      this.logger.log(`Fetching pinned numbers for conversationId: ${conversationId}`);

      const pinnedNumbers = await this.openPhoneEventService.getAllPinnedNumbers(conversationId);

      this.logger.log("Pinned numbers fetched successfully");
      this.logger.log(`Response: ${JSON.stringify(pinnedNumbers)}`);

      return {
        message: `Pinned numbers fetched successfully for conversationId: ${conversationId}`,
        data: pinnedNumbers,
      };
    } catch (error) {
      this.logger.error(`Error in getPinnedNumbers for conversationId: ${conversationId}`, error.message);
      console.error("Error in getPinnedNumbers:", error);

      throw new InternalServerErrorException("Failed to fetch pinned numbers");
    }
  }
}
