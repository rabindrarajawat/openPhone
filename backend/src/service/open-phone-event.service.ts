import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OpenPhoneEventEntity } from "../entities/open-phone-event.entity";
import { OpenPhoneEventDto } from "../dto/open-phone-event.dto";
import { AddressEntity } from "../entities/address.entity";

@Injectable()
export class OpenPhoneEventService {
  constructor(
    @InjectRepository(OpenPhoneEventEntity)
    private readonly openPhoneEventRepository: Repository<OpenPhoneEventEntity>,
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>
  ) {}

  async create(openPhoneEventDto: OpenPhoneEventDto): Promise<{
    openPhoneEvent: OpenPhoneEventEntity;
    address: AddressEntity;
    addressCreated: boolean;
  }> {
    const addressData = this.extractInformation(openPhoneEventDto.body);

    // Check if address with the same conversation_id or address exists
    let address = await this.addressRepository.findOne({
      where: [
        { conversation_id: openPhoneEventDto.conversation_id },
        { address: addressData.address },
      ],
    });

    let addressCreated = false;

    if (!address) {
      // Create new address if it doesn't exist
      address = this.addressRepository.create({
        ...addressData,
        conversation_id: openPhoneEventDto.conversation_id,
        created_by: openPhoneEventDto.created_by,
        is_active: openPhoneEventDto.is_active,
      });
      address = await this.addressRepository.save(address);
      addressCreated = true;
    }

    // Create open phone event
    const openPhoneEvent = this.openPhoneEventRepository.create({
      ...openPhoneEventDto,
      address_id: address.id,
      created_at: new Date(),
      received_at: new Date(),
    });

    // Remove fields that should be handled by the server
    delete openPhoneEvent.created_at;
    delete openPhoneEvent.received_at;
    delete openPhoneEvent.modified_at;

    const savedOpenPhoneEvent =
      await this.openPhoneEventRepository.save(openPhoneEvent);

    return { openPhoneEvent: savedOpenPhoneEvent, address, addressCreated };
  }

  async findAll(): Promise<OpenPhoneEventEntity[]> {
    return this.openPhoneEventRepository.find();
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
}
