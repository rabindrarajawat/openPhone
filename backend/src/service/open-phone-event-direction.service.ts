import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OpenPhoneEventDirectionDTO } from "src/dto/open-phone-event-direction.dto";
import { OpenPhoneEventDirectionEntity } from "src/entities/open-phone-event-direction.entity";
import { Repository } from "typeorm";

@Injectable()
export class OpenPhoneEventDirectionService {
  constructor(
    @InjectRepository(OpenPhoneEventDirectionEntity)
    private readonly openPhoneEventTypeRepository: Repository<OpenPhoneEventDirectionEntity>
  ) {}

  async createOpenPhoneEventType(openPhoneEventTypeDto: OpenPhoneEventDirectionDTO): Promise<OpenPhoneEventDirectionEntity> {
    const addressData = this.openPhoneEventTypeRepository.create(openPhoneEventTypeDto);

    return this.openPhoneEventTypeRepository.save(addressData);
  }

  async findAll(): Promise<OpenPhoneEventDirectionEntity[]> {
    return this.openPhoneEventTypeRepository.find();
  }
}
