// import { Injectable, NotFoundException } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { ILike, Repository } from "typeorm";
// import { OpenPhoneEventEntity } from "../entities/open-phone-event.entity";
// import { OpenPhoneEventDto } from "../dto/open-phone-event.dto";
// import { AddressEntity } from "../entities/address.entity";

// @Injectable()
// export class OpenPhoneEventService {
//   constructor(
//     @InjectRepository(OpenPhoneEventEntity)
//     private readonly openPhoneEventRepository: Repository<OpenPhoneEventEntity>,
//     @InjectRepository(AddressEntity)
//     private readonly addressRepository: Repository<AddressEntity>
//   ) {}

//   async create(openPhoneEventDto: OpenPhoneEventDto): Promise<{
//     openPhoneEvent: OpenPhoneEventEntity;
//     address: AddressEntity;
//     addressCreated: boolean;
//   }> {
//     console.log(
//       "🚀 ~ OpenPhoneEventService ~ create ~ OpenPhoneEventDto:",
//       OpenPhoneEventDto
//     );

//     const addressData = this.extractInformation(openPhoneEventDto.body);

//     // Check if address with the same conversation_id or address exists
//     let address = await this.addressRepository.findOne({
//       where: [
//         // { conversation_id: openPhoneEventDto.conversation_id },
//         { address: addressData.address },
//       ],
//     });

//     let addressCreated = false;

//     if (!address) {
//       // Create new address if it doesn't exist
//       address = this.addressRepository.create({
//         ...addressData,
//         // conversation_id: openPhoneEventDto.conversation_id,
//         created_by: openPhoneEventDto.created_by,
//         is_active: openPhoneEventDto.is_active,
//       });
//       address = await this.addressRepository.save(address);
//       addressCreated = true;
//     }

//     // Create open phone event
//     const openPhoneEvent = this.openPhoneEventRepository.create({
//       ...openPhoneEventDto,
//       // conversation_id: address.conversation_id,
//       address_id: address.id,
//       created_at: new Date(),
//       received_at: new Date(),
//     });

//     // Remove fields that should be handled by the server
//     delete openPhoneEvent.created_at;
//     delete openPhoneEvent.received_at;
//     delete openPhoneEvent.modified_at;

//     const savedOpenPhoneEvent =
//       await this.openPhoneEventRepository.save(openPhoneEvent);

//     return { openPhoneEvent: savedOpenPhoneEvent, address, addressCreated };
//   }

//   async findAll(): Promise<OpenPhoneEventEntity[]> {
//     return this.openPhoneEventRepository.find();
//   }
//   const addressData = this.extractInformation(openPhoneEventDto.body);

// private extractInformation(message: string) {
//   const addressRegex = /(?:house at|house at |at)\s+(.*?)(?:,|\s+for|\.)/i;
//   const auctionTypeRegex = /(tax auction|auction|foreclosure)/i;
//   const nameRegex = /Hello\s+(.*?)\./i;
//   const dateRegex = /\b(\d{1,2}\/\d{1,2})\b/i;

//   const addressMatch = message.match(addressRegex);
//   const auctionTypeMatch = message.match(auctionTypeRegex);
//   const nameMatch = message.match(nameRegex);
//   const dateMatch = message.match(dateRegex);

//   return {
//     address: addressMatch ? addressMatch[1].trim() : null,
//     auction_type: auctionTypeMatch ? auctionTypeMatch[1].toLowerCase() : null,
//     name: nameMatch ? nameMatch[1].trim() : null,
//     date: dateMatch ? new Date(dateMatch[1]) : null,
//   };
// }

// async findOpenPhoneEventsByAddress(
//   address: string
// ): Promise<Partial<OpenPhoneEventEntity>[]> {
//   const addressData = await this.addressRepository.findOne({
//     where: { address: address },
//   });

//   if (!addressData) {
//     throw new NotFoundException(`Address not found: ${address}`);
//   }

//   // const openPhoneEvents = await this.openPhoneEventRepository.find({
//   //   where: { conversation_id: addressData.conversation_id },
//   // });

// //   if (openPhoneEvents.length === 0) {
// //     throw new NotFoundException(
// //       `No OpenPhoneEvents found for address: ${address}`
// //     );
// //   }

// //   const eventsWithoutBody = openPhoneEvents.map((event) => {
// //     const { body, ...eventWithoutBody } = event;
// //     return eventWithoutBody;
// //   });

// //   return eventsWithoutBody;
// // }

//   //   // async searchAddresses(searchTerm: string): Promise<AddressEntity[]> {
//   //   //   return this.addressRepository.find({
//   //   //     where: [
//   //   //       { address: ILike(`%${searchTerm}%`) },
//   //   //       { name: ILike(`%${searchTerm}%`) },
//   //   //       // { conversation_id: ILike(`%${searchTerm}%`) },
//   //   //       { created_by: ILike(`%${searchTerm}%`) },
//   //   //       // { zipCode: ILike(`%${searchTerm}%`) },
//   //   //     ],
//   //   //     take: 10,
//   //   //   });
//   //   // }

//   // }
// }







import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OpenPhoneEventEntity } from "../entities/open-phone-event.entity";
import { AddressService } from "./address.service";
import { AddressDto } from "../dto/address.dto";
import { AddressEntity } from "../entities/address.entity";
import { AuctionEventService } from "./auction-event.service";
import { AuctionEventDto } from "src/dto/auction-event.dto";
@Injectable()
export class OpenPhoneEventService {
  constructor(
    @InjectRepository(OpenPhoneEventEntity)
    private openPhoneEventRepository: Repository<OpenPhoneEventEntity>,
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
    private addressService: AddressService,
    private auctionService: AuctionEventService
  ) { }

  async create(payload: any) {
    const messageData = payload.data.object;
    const body = messageData.body;

    let addressId = null;
    let addressCreated = false;
    let event_id = null;
    // Extract address from body and save it
    if (body) {
      const extractedInfo = this.extractInformation(body);


      if (extractedInfo.address) {
        // Check if the address already exists
        const existingAddress = await this.addressRepository.findOne({
          where: { address: extractedInfo.address },
        });

        if (existingAddress) {
          addressId = null;
        } else {
          const addressDto: AddressDto = {
            address: extractedInfo.address,
            date: extractedInfo.date || new Date(),
            created_by: "Ram",
            is_active: true,
          };

          try {
            const savedAddress =
              await this.addressService.createAddress(addressDto);
            addressId = savedAddress.id;
            addressCreated = true;
          } catch (error) {
            console.error("Error saving address:", error);
          }
        }
      } else {
        console.warn("Extracted address is null or empty.");
      }
    } else {
      console.warn("Body is null or empty.");
    }

    const openPhoneEvent = new OpenPhoneEventEntity();
    openPhoneEvent.event_type_id = this.getEventTypeId(payload.type);
    openPhoneEvent.address_id = addressId;
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
    openPhoneEvent.is_stop = body.toLowerCase().includes("stop");

    try {
      const savedOpenPhoneEvent =
        await this.openPhoneEventRepository.save(openPhoneEvent);
      const auctionEventDto: AuctionEventDto = {
        event_id: savedOpenPhoneEvent.id,
        created_by: "Ram",
      };
      const saveEventId = await this.auctionService.create(auctionEventDto);
      console.log(
        "🚀 ~ OpenPhoneEventService ~ create ~ saveEventId:",
        saveEventId
      );

      return { openPhoneEvent: savedOpenPhoneEvent, addressCreated };
    } catch (error) {
      console.error("Error saving open phone event:", error);
    }
  }

  async findAll() {
    return this.openPhoneEventRepository.find();
  }

  private getEventTypeId(type: string): number {
    switch (type) {
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


  async findOpenPhoneEventsByAddress(
    address: string
  ): Promise<Partial<OpenPhoneEventEntity>[]> {
    // Fetch address data based on the provided address
    const addressData = await this.addressRepository.findOne({
      where: { address: address },
    });

    // If address is not found, throw an exception
    if (!addressData) {
      throw new NotFoundException(`Address not found: ${address}`);
    }

    // Fetch OpenPhone events using the address_id from the found address
    const openPhoneEvents = await this.openPhoneEventRepository.find({
      where: { address_id: addressData.id },
    });

    // If no events are found, throw an exception
    if (openPhoneEvents.length === 0) {
      throw new NotFoundException(`No OpenPhoneEvents found for address: ${address}`);
    }

    // Map through the events and remove the body field from each event
    const eventsWithoutBody = openPhoneEvents.map((event) => {
      const { body, ...eventWithoutBody } = event;
      return eventWithoutBody;
    });

    // Return the events without their body field
    return eventsWithoutBody;
  }


  async findEventBodiesByConversationId(conversationId: string): Promise<{ event_type_id: number, body: string }[]> {
    try {
      // Fetch events by conversation_id and order by id in ascending order
      const events = await this.openPhoneEventRepository.find({
        where: { conversation_id: conversationId },
        order: { id: 'ASC' }, // Sort by id in ascending order
      });

      // Check if events are found
      if (events.length === 0) {
        throw new NotFoundException(`No events found for conversation_id: ${conversationId}`);
      }

      // Extract the 'event_type_id' and 'body' value from each event
      return events.map(event => ({
        event_type_id: event.event_type_id,
        body: event.body,
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }
}
