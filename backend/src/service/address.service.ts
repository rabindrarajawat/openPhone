import { AddressDto } from "../dto/address.dto";
import { AddressEntity } from "../entities/address.entity";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>
  ) {}

  async createAddress(addressDto: AddressDto): Promise<AddressEntity> {
    const result = this.extractInformation(addressDto.address);

    const addressData = this.addressRepository.create({
      ...result,
      created_by: addressDto.created_by,
      is_active: addressDto.is_active,
      name: result.name,
    });

    delete addressData.modified_by;
    delete addressData.modified_at;

    return this.addressRepository.save(addressData);
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

  async findAll(): Promise<AddressEntity[]> {
    return this.addressRepository.find();
  }

  // async findByAddress(address: string): Promise<AddressEntity> {
  //   const addressData = await this.addressRepository.findOne({
  //     where: { address: address }
  //   });

  //   if (!addressData) {
  //     throw new NotFoundException(`Address not found: ${address}`);
  //   }

  //   return addressData;
  // }

}
