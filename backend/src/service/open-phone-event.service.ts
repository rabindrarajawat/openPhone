import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
@Injectable()
export class OpenPhoneEventService {
  constructor(
    @InjectRepository(OpenPhoneEventEntity)
    private openPhoneEventRepository: Repository<OpenPhoneEventEntity>,
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
    private addressService: AddressService,
    private auctionService: AuctionEventService,
    private notificationService: NotificationService,

  ) { }

  async create(payload: OpenPhoneEventDto) {
    try {
      // Validate the payload
      const errors = await validate(payload);
      if (errors.length > 0) {
        const errorMessages = errors
          .map((error) => Object.values(error.constraints))
          .flat();
        throw new BadRequestException(
          `Invalid payload: ${errorMessages.join(", ")}`
        );
      }

      const messageData = payload.data.object;
      const body = messageData.body || null; // Handle the case where body might be null

      // Check event type
      const eventTypeId = this.getEventTypeId(payload.type);
      if (eventTypeId === null || eventTypeId === undefined) {
        throw new BadRequestException(`Invalid event type: ${payload.type}`);
      }

      let addressId = null;
      let addressCreated = false;
      let auctionTypeId = null;

      // Extract address from body if body is not null and save it
      if (body) {
        const extractedInfo = this.extractInformation(body);

        auctionTypeId = this.auctionTypeId(extractedInfo.auction_type)
        if (
          !extractedInfo.address &&
          payload.data.object.status === "outgoing"
        ) {
          throw new BadRequestException("Extracted address is null or empty");
        }

        // Check if the address already exists
        const existingAddress = await this.addressRepository.findOne({
          where: { address: extractedInfo.address },
        });

        if (!existingAddress) {
          const addressDto: AddressDto = {
            address: extractedInfo.address,
            date: extractedInfo.date || new Date(),
            created_by: "Ram",
            is_active: true,
            is_bookmarked: false,
            auction_event_id: auctionTypeId,
          };

          // Validate the addressDto
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
          addressId = existingAddress.id;
        }
      }

      const existingEvent = await this.openPhoneEventRepository.findOne({
        where: { conversation_id: messageData.conversationId },
      });

      const openPhoneEvent = new OpenPhoneEventEntity();
      openPhoneEvent.event_type_id = eventTypeId;
      openPhoneEvent.address_id =
        messageData.status === "delivered"
          ? existingEvent?.address_id
          : addressId;
      openPhoneEvent.auction_event_id = !existingEvent ? auctionTypeId : null;
      if (existingEvent !== null) {
        if (
          existingEvent.conversation_id === messageData.conversationId &&
          messageData.status === "received" &&
          existingEvent.to !== messageData.from
        ) {
          openPhoneEvent.address_id = null;
        }
      }

      openPhoneEvent.event_direction_id = this.getEventDirectionId(
        messageData.direction
      );
      openPhoneEvent.from = messageData.from;
      openPhoneEvent.to = messageData.to;
      openPhoneEvent.body = body;
      openPhoneEvent.url =
        messageData.media && messageData.media.length > 0
          ? messageData.media[0].url
          : "url";
      openPhoneEvent.url_type =
        messageData.media && messageData.media.length > 0
          ? messageData.media[0].type
          : "image";
      openPhoneEvent.conversation_id = messageData.conversationId;
      openPhoneEvent.created_at = messageData.createdAt;
      openPhoneEvent.received_at = payload.createdAt;
      openPhoneEvent.contact_established = "NA";
      openPhoneEvent.dead = "No";
      openPhoneEvent.keep_an_eye = "Yes";
      openPhoneEvent.is_stop = false;
      openPhoneEvent.created_by = "Ram";
      openPhoneEvent.phone_number_id = messageData.phoneNumberId;
      openPhoneEvent.user_id = messageData.userId;

      // Validate the openPhoneEvent
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
      await this.notificationService.createNotification(savedOpenPhoneEvent.id);
      const auctionEventDto: AuctionEventDto = {
        event_id: savedOpenPhoneEvent.id,
        created_by: "Ram",
      };

      // Validate the auctionEventDto
      const auctionErrors = await validate(auctionEventDto);
      if (auctionErrors.length > 0) {
        const errorMessages = auctionErrors
          .map((error) => Object.values(error.constraints))
          .flat();
        throw new BadRequestException(
          `Invalid auction event data: ${errorMessages.join(", ")}`
        );
      }

      const saveEventId = await this.auctionService.create(auctionEventDto);

      return { openPhoneEvent: savedOpenPhoneEvent, addressCreated };
    } catch (error) {
      console.error("Error in create method:", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Error) {
        // Check if the error is a database constraint violation
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
      case "tax auction":
        return 2;
      case "foreclosure":
        return 3;
      default:
        return null; // Add a default case
    }
  }

  private extractInformation(message: string) {
    const addressRegex = /(?:house at|house at |at)\s+(.*?)(?:,|\s+for|\.)/i;
    const auctionTypeRegex = /(tax auction|auction|foreclosure)/i;
    const nameRegex = /Hello\s+(.*?)\./i;
    const dateRegex = /\b(\d{1,2}\/\d{1,2})\b/i;

    const addressMatch = message.match(addressRegex);
    const auctionTypeMatch = message.match(auctionTypeRegex);
    const nameMatch = message.match(nameRegex);
    const dateMatch = message.match(dateRegex);

    return {
      address: addressMatch ? addressMatch[1].trim() : null,
      auction_type: auctionTypeMatch ? auctionTypeMatch[1].toLowerCase() : null,
      name: nameMatch ? nameMatch[1].trim() : null,
      date: dateMatch ? new Date(dateMatch[1]) : null,
    };
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


  // async findAllFiltered(filter?: 'delivered' | 'received') {
  //   const query = this.openPhoneEventRepository.createQueryBuilder('event');

  //   if (filter === 'delivered') {
  //     query.where('event.event_type_id = :id', { id: 2 });
  //   } else if (filter === 'received') {
  //     query.where('event.event_type_id = :id', { id: 1 });
  //   }

  //   return query.getMany();
  // }






  async findAllFiltered(filter?: 'delivered' | 'received') {
    const query = this.openPhoneEventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.address', 'address');

    if (filter === 'delivered') {
      query.where('event.event_type_id = :id', { id: 2 });
    } else if (filter === 'received') {
      query.where('event.event_type_id = :id', { id: 1 });
    }

    const events = await query.getMany();

    const addressIds = events.map(event => event.address_id).filter(id => id != null);
    const addresses = await this.addressRepository.findByIds(addressIds);
    const addressMap = new Map(addresses.map(addr => [addr.id, addr.address]));

    return events.map(event => ({
      ...event,
      address: event.address_id ? addressMap.get(event.address_id) : null,
    }));
  }
}



