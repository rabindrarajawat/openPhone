import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OpenPhoneEventService } from "../service/open-phone-event.service";
import { OpenPhoneEventController } from "../controller/open-phone-event.controller";
import { OpenPhoneEventEntity } from "../entities/open-phone-event.entity";
import { AddressEntity } from "src/entities/address.entity";
import { AddressService } from "src/service/address.service";
import { AuctionEventEntity } from "src/entities/auction-event.entity";
import { AuctionEventService } from "src/service/auction-event.service";

@Module({
  imports: [TypeOrmModule.forFeature([OpenPhoneEventEntity, AddressEntity,AuctionEventEntity])],
  controllers: [OpenPhoneEventController],
  providers: [OpenPhoneEventService, AddressService,AuctionEventService],
})
export class OpenPhoneEventModule {}
