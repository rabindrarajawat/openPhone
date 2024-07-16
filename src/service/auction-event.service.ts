// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { AuctionEvent } from '../entities/auction-event.entity';
// import { CreateAuctionEventDto } from '../dto/auction-event.dto';

// @Injectable()
// export class AuctionEventService {
//   constructor(
//     @InjectRepository(AuctionEvent)
//     private auctionEventRepository: Repository<AuctionEvent>,
//   ) {}

//   async create(createAuctionEventDto: CreateAuctionEventDto): Promise<AuctionEvent> {
//     const auctionEvent = this.auctionEventRepository.create(createAuctionEventDto);
//     return await this.auctionEventRepository.save(auctionEvent);
//   }

//   async findAll(): Promise<AuctionEvent[]> {
//     return await this.auctionEventRepository.find();
//   }

//   async findOne(id: number): Promise<AuctionEvent> {
//     return await this.auctionEventRepository.findOne({ where: { id } });
//   }
// }