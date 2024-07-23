import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OpenPhoneEventTypeDTO } from "../dto/open-phone-event-type.dto";
import { OpenPhoneEventTypeEntity } from "../entities/open-phone-event-type.entity";
import { Repository } from "typeorm";

@Injectable()
export class OpenPhoneEventTypeService {
  constructor(
    @InjectRepository(OpenPhoneEventTypeEntity)
    private readonly openPhoneEventTypeRepository: Repository<OpenPhoneEventTypeEntity>
  ) {}

  async createOpenPhoneEventType(openPhoneEventTypeDto: OpenPhoneEventTypeDTO): Promise<OpenPhoneEventTypeEntity> {
    const addressData = this.openPhoneEventTypeRepository.create(openPhoneEventTypeDto);

    return this.openPhoneEventTypeRepository.save(addressData);
  }

  async findAll(): Promise<OpenPhoneEventTypeEntity[]> {
    return this.openPhoneEventTypeRepository.find();
  }
}
