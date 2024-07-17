import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OpenPhoneEventEntity } from "../entities/open-phone-event.entity";
import { OpenPhoneEventDto } from "../dto/open-phone-event.dto";

@Injectable()
export class OpenPhoneEventService {
  constructor(
    @InjectRepository(OpenPhoneEventEntity)
    private readonly openPhoneEventRepository: Repository<OpenPhoneEventEntity>
  ) {}

  async create(openPhoneEventDto: OpenPhoneEventDto): Promise<OpenPhoneEventEntity> {
    const openPhoneEvent =
      this.openPhoneEventRepository.create(openPhoneEventDto);
    return this.openPhoneEventRepository.save(openPhoneEvent);
  }

  async findAll(): Promise<OpenPhoneEventEntity[]> {
    return this.openPhoneEventRepository.find();
  }
}
