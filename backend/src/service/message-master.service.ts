import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
 import { MessageMasterDto } from "../dto/message-master.dto";
 import { MessageMasterEntity } from "../entities/message-template.entity";
import { Repository } from "typeorm";

@Injectable()
export class MessageMasterService {
  constructor(
    @InjectRepository(MessageMasterEntity)
    private readonly messageRepository: Repository<MessageMasterEntity>
  ) {}

  async create(messageDto: MessageMasterDto): Promise<MessageMasterEntity> {
    const messageData = this.messageRepository.create(messageDto);

    const x = await this.messageRepository.save(messageData);
    return x;
  }

  async findAll(): Promise<MessageMasterEntity[]> {
    return await this.messageRepository.find();
  }
}
