
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { AddressDto } from "../dto/address.dto";
import { AddressEntity } from "../entities/address.entity";

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>
  ) {}

  async createAddress(addressDto: {
    address: string;
    date: Date;
    auction_event_id: number;
  }) {
    try {
      const address = this.addressRepository.create({
        address: addressDto.address,
        date: addressDto.date,
        created_by: "Admin",
        is_active: true,
        auction_event_id: addressDto.auction_event_id,
      });

      return await this.addressRepository.save(address);
    } catch (error) {
      console.error("Error saving address:", error);
      throw new InternalServerErrorException("Error saving address");
    }
  }

  // async findAll(): Promise<AddressEntity[]> {
  //   try {
  //     return this.addressRepository.find();
  //   } catch (error) {
  //     console.error("Error finding all addresses:", error);
  //     throw new InternalServerErrorException("Error finding all addresses");
  //   }
  // }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: AddressEntity[]; totalCount: number }> {
    if (isNaN(page) || page <= 0) {
      page = 1;
    }
    if (isNaN(limit) || limit <= 0) {
      limit = 10;
    }
    try {
      const [data, totalCount] = await this.addressRepository.findAndCount({
        where: { is_active: true },
        order: { created_at: "DESC" },
        skip: (page - 1) * limit,
        take: limit,
      });

      return { data, totalCount };
    } catch (error) {
      console.error("Error finding all addresses:", error);
      throw new InternalServerErrorException("Error finding all addresses");
    }
  }

  async searchAddresses(searchTerm: string): Promise<AddressEntity[]> {
    try {
      return this.addressRepository.find({
        where: [
          { address: ILike(`%${searchTerm}%`) },
          { created_by: ILike(`%${searchTerm}%`) },
        ],
        take: 10,
      });
    } catch (error) {
      console.error("Error searching addresses:", error);
      throw new InternalServerErrorException("Error searching addresses");
    }
  }

  async getAddressIdByAddress(address: string): Promise<number | null> {
    try {
      const foundAddress = await this.addressRepository.findOne({
        where: { address },
        select: ["id"],
      });

      return foundAddress ? foundAddress.id : null;
    } catch (error) {
      console.error("Error getting address ID:", error);
      throw new InternalServerErrorException("Error getting address ID");
    }
  }
}
