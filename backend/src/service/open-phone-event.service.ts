import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OpenPhoneEvent } from "../entities/open-phone-event.entity";
import { OpenPhoneEventDto } from "../dto/open-phone-event.dto";

@Injectable()
export class OpenPhoneEventService {
  constructor(
    @InjectRepository(OpenPhoneEvent)
    private readonly openPhoneEventRepository: Repository<OpenPhoneEvent>
  ) {}

  async create(openPhoneEventDto: OpenPhoneEventDto): Promise<OpenPhoneEvent> {
    const openPhoneEvent =
      this.openPhoneEventRepository.create(openPhoneEventDto);
    return this.openPhoneEventRepository.save(openPhoneEvent);
  }

  async findAll(): Promise<OpenPhoneEvent[]> {
    return this.openPhoneEventRepository.find();
  }
}
