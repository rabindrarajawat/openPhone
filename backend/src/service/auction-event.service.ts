import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuctionEventEntity } from '../entities/auction-event.entity';
import { AuctionEventDto } from '../dto/auction-event.dto';

@Injectable()
export class AuctionEventService {
  constructor(
    @InjectRepository(AuctionEventEntity)
    private auctionEventRepository: Repository<AuctionEventEntity>,
  ) {}

  async create(createAuctionEventDto: AuctionEventDto): Promise<AuctionEventEntity> {
    const auctionEvent = this.auctionEventRepository.create(createAuctionEventDto);
    return await this.auctionEventRepository.save(auctionEvent);
  }

  async findAll(): Promise<AuctionEventEntity[]> {
    return await this.auctionEventRepository.find();
  }

  async findOne(id: number): Promise<AuctionEventEntity> {
    return await this.auctionEventRepository.findOne({ where: { id } });
  }
}