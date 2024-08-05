import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OpenPhoneEventService } from "../service/open-phone-event.service";
import { OpenPhoneEventController } from "../controller/open-phone-event.controller";
import { OpenPhoneEventEntity } from "../entities/open-phone-event.entity";
import { AddressEntity } from "src/entities/address.entity";
import { AddressService } from "src/service/address.service";
import { AuctionEventEntity } from "src/entities/auction-event.entity";
import { AuctionEventService } from "src/service/auction-event.service";
import { NotificationEntity } from "src/entities/notification.entity";
import { NotificationService } from "src/service/notification.service";
import { NotificationGateway } from "src/gateways/notification.gateway";

@Module({
  imports: [TypeOrmModule.forFeature([OpenPhoneEventEntity, AddressEntity,AuctionEventEntity,NotificationEntity,NotificationGateway])],
  controllers: [OpenPhoneEventController],
  providers: [OpenPhoneEventService, AddressService,AuctionEventService,NotificationService,NotificationGateway],
})
export class OpenPhoneEventModule {}
