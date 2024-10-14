import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { OpenPhoneEventEntity } from "../entities/open-phone-event.entity";
import { AddressService } from "./address.service";
import { AddressDto } from "../dto/address.dto";
import { AddressEntity } from "../entities/address.entity";
import { AuctionEventService } from "./auction-event.service";
import { AuctionEventDto } from "src/dto/auction-event.dto";
import { validate } from "class-validator";
import { OpenPhoneEventDto } from "../dto/open-phone-event.dto";
import { NotificationService } from "./notification.service";
import { TemplatesExpressionsEntity } from "../entities/template-expressions.entity";
@Injectable()
export class OpenPhoneEventService {
  private regexPatterns: {
    address: RegExp;
    auctionType: RegExp;
    name: RegExp;
    date: RegExp;
  } | null = null;
  constructor(
    @InjectRepository(OpenPhoneEventEntity)
    private openPhoneEventRepository: Repository<OpenPhoneEventEntity>,
    @InjectRepository(AddressEntity)
    @InjectRepository(TemplatesExpressionsEntity)
    private addressRepository: Repository<AddressEntity>,
    private addressService: AddressService,
    private auctionService: AuctionEventService,
    private notificationService: NotificationService,
    @InjectRepository(TemplatesExpressionsEntity)
    private templateExpressionsRepository: Repository<TemplatesExpressionsEntity>
  ) {}

  private extractInformation(message: string, templates: any[]) {
    // Use the first template since we're storing all expressions in one record
    const template = templates[0];

    const createRegExp = (pattern: string) => {
      if (!pattern) return null;
      pattern = pattern.replace(/;$/, ""); // Remove trailing semicolon if present
      const lastSlashIndex = pattern.lastIndexOf("/");
      if (lastSlashIndex === -1) {
        // If the pattern doesn't include slashes, wrap it with slashes and add 'i' flag
        return new RegExp(pattern, "i");
      }
      const flags = pattern.slice(lastSlashIndex + 1); // Extract flags
      const patternBody = pattern.slice(1, lastSlashIndex); // Extract pattern
      return new RegExp(patternBody, flags);
    };

    // Extract regex patterns from the template
    const addressRegex = createRegExp(template.address_expression);
    const auctionTypeRegex = createRegExp(template.type_expression);
    const disasterAssistanceRegex = createRegExp(
      template.disaster_assistance_expression
    );
    const nameRegex = createRegExp(template.name_regex);
    const dateRegex = createRegExp(template.date_regex);

    // Match the message against all patterns
    const addressMatch = addressRegex ? message.match(addressRegex) : null;
    const auctionTypeMatch = auctionTypeRegex
      ? message.match(auctionTypeRegex)
      : null;
    const disasterAssistanceMatch = disasterAssistanceRegex
      ? message.match(disasterAssistanceRegex)
      : null;
    const nameMatch = nameRegex ? message.match(nameRegex) : null;
    const dateMatch = dateRegex ? message.match(dateRegex) : null;

    // Extract the address correctly from either of the matched groups
    const extractedAddress = addressMatch
      ? (addressMatch[1] || addressMatch[2])?.trim()
      : null;

    // Determine the auction type based on the message content
    let auctionType = null;

    if (disasterAssistanceMatch) {
      auctionType = "disaster assistance";
    } else if (auctionTypeMatch) {
      auctionType = auctionTypeMatch[1]?.toLowerCase();
    }

    // Helper function to parse date string to Date object
    const parseDate = (dateString: string): Date | null => {
      try {
        const [month, day] = dateString.split("/").map(Number);
        if (month && day) {
          const currentYear = new Date().getFullYear();
          const date = new Date(currentYear, month - 1, day + 1);
          return isNaN(date.getTime()) ? null : date;
        }
        return null;
      } catch {
        return null;
      }
    };

    return {
      address: extractedAddress,
      auction_type: auctionType,
      name: nameMatch ? nameMatch[1]?.trim() : null,
      date: dateMatch ? parseDate(dateMatch[1]) : null,
    };
  }

  async create(payload: OpenPhoneEventDto) {
    const templates = await this.templateExpressionsRepository.find();
    try {
      if (!payload || !payload.data || !payload.data.object) {
        return { openPhoneEvent: null, addressCreated: false };
      }

      const messageData = payload.data.object;
      const body = messageData.body || null;
      const existingEvent = await this.openPhoneEventRepository.findOne({
        where: { conversation_id: messageData.conversationId },
      });

      const eventTypeId = this.getEventTypeId(payload.type);
      if (eventTypeId === null || eventTypeId === undefined) {
        throw new BadRequestException(`Invalid event type: ${payload.type}`);
      }

      let addressId = null;
      let addressCreated = false;
      let auctionTypeId = null;

      if (body) {
        const extractedInfo = this.extractInformation(body, templates);
        console.log(
          "🚀 ~ OpenPhoneEventService ~ create ~ extractedInfo:",
          extractedInfo
        );

        auctionTypeId = this.auctionTypeId(extractedInfo.auction_type);

        // Only try to save the address if it's not null
        if (extractedInfo.address) {
          const existingAddress = await this.addressRepository.findOne({
            where: { address: extractedInfo.address },
          });

          if (!existingAddress) {
            const addressDto: AddressDto = {
              address: extractedInfo.address,
              date: extractedInfo.date || new Date(),
              created_by: "Admin",
              is_active: true,
              is_bookmarked: false,
              auction_event_id: auctionTypeId,
              modified_at: new Date(),
            };

            const addressErrors = await validate(addressDto);
            if (addressErrors.length > 0) {
              const errorMessages = addressErrors
                .map((error) => Object.values(error.constraints))
                .flat();
              throw new BadRequestException(
                `Invalid address data: ${errorMessages.join(", ")}`
              );
            }

            if (
              addressDto.auction_event_id === null ||
              addressDto.auction_event_id === undefined
            ) {
              throw new BadRequestException("Invalid auction_event_id");
            }

            const savedAddress =
              await this.addressService.createAddress(addressDto);
            addressId = savedAddress.id;
            addressCreated = true;
          } else {
            await this.addressRepository.update(
              { id: existingAddress.id },
              { modified_at: new Date() }
            );
            addressId = existingAddress.id;
          }
        }
      }
      //  Message related to existing conversation

      // else if (existingEvent?.address_id) {
      //   await this.addressRepository.update(
      //     { id: existingEvent.address_id },
      //     { modified_at: new Date() }
      //   );
      //   addressId = existingEvent.address_id;
      // }

      // Creating the event regardless of the address presence
      const openPhoneEvent = new OpenPhoneEventEntity();
      openPhoneEvent.event_type_id = eventTypeId;
      openPhoneEvent.address_id =
        addressId || existingEvent?.address_id || null; // Keep null if no address
      openPhoneEvent.auction_event_id = !existingEvent ? auctionTypeId : null;
      openPhoneEvent.event_direction_id = this.getEventDirectionId(
        messageData.direction
      );
      openPhoneEvent.from = messageData.from;
      openPhoneEvent.to = messageData.to;
      openPhoneEvent.body = body;
      openPhoneEvent.url = messageData.media?.[0]?.url || "url";
      openPhoneEvent.url_type = messageData.media?.[0]?.type || "image";
      openPhoneEvent.conversation_id = messageData.conversationId;
      openPhoneEvent.created_at = messageData.createdAt;
      openPhoneEvent.received_at = payload.createdAt;
      openPhoneEvent.contact_established = "NA";
      openPhoneEvent.dead = "No";
      openPhoneEvent.keep_an_eye = "Yes";
      openPhoneEvent.is_stop = messageData.body.toUpperCase() === "STOP" ? true : false;
      openPhoneEvent.created_by = "Admin";
      openPhoneEvent.phone_number_id = messageData.phoneNumberId;
      openPhoneEvent.user_id = messageData.userId;

      const eventErrors = await validate(openPhoneEvent);
      if (eventErrors.length > 0) {
        const errorMessages = eventErrors
          .map((error) => Object.values(error.constraints))
          .flat();
        throw new BadRequestException(
          `Invalid open phone event data: ${errorMessages.join(", ")}`
        );
      }

      const savedOpenPhoneEvent =
        await this.openPhoneEventRepository.save(openPhoneEvent);

      if (savedOpenPhoneEvent.address_id) {
        await this.addressRepository.update(
          { id: savedOpenPhoneEvent.address_id },
          { modified_at: new Date() }
        );
      }
      await this.notificationService.createNotification(savedOpenPhoneEvent.id);
      const auctionEventDto: AuctionEventDto = {
        event_id: savedOpenPhoneEvent.id,
        created_by: "Admin",
      };

      const auctionErrors = await validate(auctionEventDto);
      if (auctionErrors.length > 0) {
        const errorMessages = auctionErrors
          .map((error) => Object.values(error.constraints))
          .flat();
        throw new BadRequestException(
          `Invalid auction event data: ${errorMessages.join(", ")}`
        );
      }

      await this.auctionService.create(auctionEventDto);

      return { openPhoneEvent: savedOpenPhoneEvent, addressCreated };
    } catch (error) {
      console.error("Error in create method:", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Error) {
        if (error.message.includes("violates not-null constraint")) {
          throw new BadRequestException(`Invalid data: ${error.message}`);
        }
        throw new InternalServerErrorException(
          `Error saving open phone event: ${error.message}`
        );
      }
      throw new InternalServerErrorException("An unknown error occurred");
    }
  }

  async findAll() {
    return this.openPhoneEventRepository.find();
  }

  private getEventTypeId(type: string): number | null {
    switch (type.toLowerCase()) {
      case "message.received":
        return 1;
      case "message.delivered":
        return 2;
      case "call.ringing":
        return 3;
      case "call.completed":
        return 4;
      case "call.recording.completed":
        return 5;
      case "contact.updated":
        return 6;
    }
  }

  private getEventDirectionId(direction: string): number {
    switch (direction) {
      case "incoming":
        return 1;
      case "outgoing":
        return 2;
    }
  }

  private auctionTypeId(type: string): number | null {
    switch (type?.toLowerCase()) {
      case "auction":
        return 1;
      case "tax auction": //tax dead
        return 2;
      case "foreclosure": //case
        return 3;
      case "disaster assistance":
        return 4;
      default:
        return null;
    }
  }

  async findOpenPhoneEventsByAddress(address: string): Promise<{
    events: Partial<OpenPhoneEventEntity>[];
    messageDelivered: number;
    messageResponse: number;
    call: number;
    callResponse: number;
  }> {
    // Fetch address data based on the provided address
    const addressData = await this.addressRepository.findOne({
      where: { address: address },
    });

    // If address is not found, throw an exception
    if (!addressData) {
      throw new NotFoundException(`Address not found: ${address}`);
    }

    // Fetch OpenPhone events using the address_id from the found address
    const initialEvents = await this.openPhoneEventRepository.find({
      where: { address_id: addressData.id },
      order: { id: "ASC" },
    });

    // Collect all conversation IDs from the initial events
    const conversationIds = initialEvents.map((event) => event.conversation_id);

    // Fetch additional events based on collected conversation IDs
    const additionalEvents = await this.openPhoneEventRepository.find({
      where: { conversation_id: In(conversationIds) },
      order: { id: "ASC" },
    });

    // Combine initial and additional events, ensuring no duplicates
    const allEvents = [
      ...initialEvents,
      ...additionalEvents.filter(
        (event) => !initialEvents.some((e) => e.id === event.id)
      ),
    ];

    // Sort the combined events by id in ascending order
    allEvents.sort((a, b) => a.id - b.id);

    // If no events are found, throw an exception
    if (allEvents.length === 0) {
      throw new NotFoundException(
        `No OpenPhoneEvents found for address: ${address}`
      );
    }

    // Map through the events and remove the body field from each event
    const eventsWithoutBody = allEvents.map((event) => {
      const { body, ...eventWithoutBody } = event;
      return eventWithoutBody;
    });

    // Calculate counts for each event_type_id
    const messageDelivered = allEvents.filter(
      (event) => event.event_type_id === 2
    ).length;
    const messageResponse = allEvents.filter(
      (event) => event.event_type_id === 1
    ).length;
    const call = allEvents.filter((event) => event.event_type_id === 3).length;
    const callResponse = allEvents.filter(
      (event) => event.event_type_id === 4
    ).length;

    // Return the events without their body field and the counts
    return {
      events: eventsWithoutBody,
      messageDelivered,
      messageResponse,
      call,
      callResponse,
    };
  }

  async findEventBodiesByAddressAndFromNumber(
    addressId: number,
    fromNumber?: string
  ) {
    // if (isNaN(addressId)) {
    //   throw new BadRequestException('Invalid addressId: not a number.');
    // }

    // // Ensure fromNumber is a string or undefined
    // if (fromNumber !== undefined && typeof fromNumber !== 'string') {
    //   throw new BadRequestException('Invalid fromNumber: not a string.');
    // }

    // Step 1: Find events that match the provided address_id and from_number
    const initialEvents = await this.openPhoneEventRepository.find({
      where: { address_id: addressId, from: fromNumber },
      order: { id: "ASC" },
    });

    if (initialEvents.length === 0) {
      throw new NotFoundException(
        `No events found for address_id: ${addressId} and from: ${fromNumber}`
      );
    }

    // Step 2: Extract the conversation_id from the found events
    const conversationIds = initialEvents.map((event) => event.conversation_id);

    // Step 3: Find all events that share the same conversation_id(s)
    const relatedEvents = await this.openPhoneEventRepository.find({
      where: { conversation_id: In(conversationIds) },
      order: { id: "ASC" },
    });

    // Step 4: Combine initial and related events, and remove duplicates
    const allEvents = [...initialEvents, ...relatedEvents];
    const uniqueEvents = Array.from(
      new Map(allEvents.map((event) => [event.id, event])).values()
    );

    // Step 5: Return unique events with only the needed fields
    return uniqueEvents.map((event) => ({
      event_type_id: event.event_type_id,
      body: event.body,
      to: event.to,
      created_at: event.created_at,
      conversation_id: event.conversation_id,
      id: event.id,
      is_message_pinned: event.is_message_pinned,
      is_stop: event.is_stop,
    }));
  }

  async findAllOpenPhoneEvents(): Promise<{
    messageDelivered: number;
    messageResponse: number;
    call: number;
    callResponse: number;
  }> {
    // Fetch all OpenPhone events
    const allEvents = await this.openPhoneEventRepository.find({
      order: { id: "ASC" },
    });

    // If no events are found, throw an exception
    if (allEvents.length === 0) {
      throw new NotFoundException(`No OpenPhoneEvents found`);
    }

    // Calculate counts for each event_type_id
    const messageDelivered = allEvents.filter(
      (event) => event.event_type_id === 2
    ).length;
    const messageResponse = allEvents.filter(
      (event) => event.event_type_id === 1
    ).length;
    const call = allEvents.filter((event) => event.event_type_id === 3).length;
    const callResponse = allEvents.filter(
      (event) => event.event_type_id === 4
    ).length;

    // Return only the counts
    return {
      messageDelivered,
      messageResponse,
      call,
      callResponse,
    };
  }

  async findConversationsWithoutAddress(): Promise<any[]> {
    const subQuery = this.openPhoneEventRepository
      .createQueryBuilder("sub_event")
      .select("sub_event.conversation_id")
      .where("sub_event.address_id IS NOT NULL");

    const openPhoneEvents = await this.openPhoneEventRepository
      .createQueryBuilder("event")
      .select(["event.conversation_id", "event.from", "event.to", "event.body"])
      .where("event.address_id IS NULL")
      .andWhere("event.conversation_id NOT IN (" + subQuery.getQuery() + ")")
      .distinct(true)
      .getRawMany();

    return openPhoneEvents.map((event) => ({
      conversation_id: event.event_conversation_id,
      from: event.event_from,
      to: event.event_to,
      body: event.event_body,
    }));
  }

  // async findConversationsWithoutAddress(
  //   page: number = 1, // Default to 1 if not provided
  //   limit: number = 10 // Default to 10 if not provided
  // ): Promise<{
  //   data: any[];
  //   totalCount: number;
  //   currentPage: number;
  //   totalPages: number;
  // }> {
  //   // Validate that page and limit are numbers
  //   if (isNaN(page) || page <= 0) {
  //     page = 1;
  //   }
  //   if (isNaN(limit) || limit <= 0) {
  //     limit = 10;
  //   }

  //   const subQuery = this.openPhoneEventRepository
  //     .createQueryBuilder("sub_event")
  //     .select("sub_event.conversation_id")
  //     .where("sub_event.address_id IS NOT NULL");

  //   // Calculate the offset for pagination
  //   const offset = (page - 1) * limit;

  //   // console.log(`Page: ${page}, Limit: ${limit}, Offset: ${offset}`);

  //   try {
  //     const [openPhoneEvents, totalCount] = await this.openPhoneEventRepository
  //       .createQueryBuilder("event")
  //       .select([
  //         "event.conversation_id",
  //         "event.from",
  //         "event.to",
  //         "event.body",
  //       ])
  //       .where("event.address_id IS NULL")
  //       .andWhere("event.conversation_id NOT IN (" + subQuery.getQuery() + ")")
  //       .distinct(true)
  //       .skip(offset) // Ensure `offset` is a valid number
  //       .take(limit)
  //       .getManyAndCount();

 
  //     const data = openPhoneEvents.map((event) => ({
  //       conversation_id: event.conversation_id,
  //       from: event.from,
  //       to: event.to,
  //       body: event.body,
  //     }));

  //     return {
  //       data,
  //       totalCount,
  //       currentPage: page,
  //       totalPages: Math.ceil(totalCount / limit),
  //     };
  //   } catch (error) {
  //     console.error("Error in findConversationsWithoutAddress:", error);
  //     throw new InternalServerErrorException(
  //       `Error fetching conversations: ${error.message}`
  //     );
  //   }
  // }

  async findAllFiltered(filter?: "delivered" | "received") {
    const query = this.openPhoneEventRepository
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.address", "address");

    if (filter === "delivered") {
      query.where("event.event_type_id = :id", { id: 2 });
    } else if (filter === "received") {
      query.where("event.event_type_id = :id", { id: 1 });
    }

    const events = await query.getMany();

    const addressIds = events
      .map((event) => event.address_id)
      .filter((id) => id != null);
    const addresses = await this.addressRepository.findByIds(addressIds);
    const addressMap = new Map(
      addresses.map((addr) => [addr.id, addr.address])
    );

    return events.map((event) => ({
      ...event,
      address: event.address_id ? addressMap.get(event.address_id) : null,
    }));
  }

  async toggleMessagePin(id: number): Promise<{ message: string }> {
    const event = await this.openPhoneEventRepository.findOne({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    event.is_message_pinned = !event.is_message_pinned;

    const updatedData = await this.openPhoneEventRepository.save(event);

    if (updatedData.is_message_pinned) {
      return {
        message: `Message pinned  for event_id ${id}`,
      };
    } else {
      return {
        message: `Message unpinned for event_id ${id}`,
      };
    }
  }

  async toggleNumberPin(conversation_id: string): Promise<{ message: string }> {
    const event = await this.openPhoneEventRepository.findOne({
      where: { conversation_id },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${conversation_id} not found`);
    }
    event.is_number_pinned = !event.is_number_pinned;
    const updatedData = await this.openPhoneEventRepository.save(event);
    if (updatedData.is_number_pinned) {
      return {
        message: `Number pinned  for conversation_id ${conversation_id}`,
      };
    } else {
      return {
        message: `Number unpinnrd for conversation_id ${conversation_id}`,
      };
    }
  }

  async getAllPinnedMessages(): Promise<OpenPhoneEventEntity[]> {
    return this.openPhoneEventRepository.find({
      where: { is_message_pinned: true },
    });
  }

  async getAllPinnedNumbers(
    conversationId: string
  ): Promise<OpenPhoneEventEntity[]> {
    return this.openPhoneEventRepository.find({
      where: {
        // is_number_pinned: true,
        conversation_id: conversationId,
      },
    });
  }
}
