import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuctionEventController } from "../controller/auction-event.controller";
import { AuctionEventService } from "../service/auction-event.service";
import { AuctionEventEntity } from "../entities/auction-event.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AuctionEventEntity])],
  controllers: [AuctionEventController],
  providers: [AuctionEventService],
})
export class AuctionEventModule {}
