import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddressDto } from "src/dto/address.dto";
import { AddressEntity } from "src/entities/address.entity";
import { Repository } from "typeorm";

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>
  ) {}

  async createAddress(addressDto: AddressDto): Promise<AddressEntity> {
    const addressData = this.addressRepository.create(addressDto);

    return this.addressRepository.save(addressData);
  }

  async findAll(): Promise<AddressEntity[]> {
    return this.addressRepository.find();
  }
}
