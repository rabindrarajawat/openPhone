import { AddressDto } from "../dto/address.dto";
import { AddressEntity } from "../entities/address.entity";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>
  ) { }

  // async createAddress(addressDto: AddressDto): Promise<AddressEntity> {
  //   const result = this.extractInformation(addressDto.address);

  //   const addressData = this.addressRepository.create({
  //     ...result,
  //     created_by: addressDto.created_by,
  //     is_active: addressDto.is_active,
  //   });

  //   delete addressData.modified_by;
  //   delete addressData.modified_at;

  //   return this.addressRepository.save(addressData);
  // }




  async createAddress(addressDto: { address: string; date: Date,auction_event_id:number }) {
    try {
      const address = this.addressRepository.create({
        address: addressDto.address,
        date: addressDto.date,
        created_by: 'Ram', // assuming 'Ram' is the user creating this entry
        is_active: true,
        auction_event_id:addressDto.auction_event_id
      });

      return await this.addressRepository.save(address);
    } catch (error) {
      console.error('Error saving address:', error);
      throw new Error('Error saving address');
    }
  }




  async findAll(): Promise<AddressEntity[]> {
    return this.addressRepository.find();
  }

  async searchAddresses(searchTerm: string): Promise<AddressEntity[]> {
    return this.addressRepository.find({
      where: [
        { address: ILike(`%${searchTerm}%`) },
        { created_by: ILike(`%${searchTerm}%`) },
      ],
      take: 10,
    });
  }

  async getAddressIdByAddress(address: string): Promise<number | null> {
    const foundAddress = await this.addressRepository.findOne({
      where: { address },
      select: ["id"], // Only select the 'id' field
    });

    return foundAddress ? foundAddress.id : null;
  }
}
