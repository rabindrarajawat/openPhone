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
import { AuthGuard } from "src/authguard/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TemplatesExpressionsEntity } from "../entities/template-expressions.entity";

@Module({
  imports: [TypeOrmModule.forFeature([OpenPhoneEventEntity,TemplatesExpressionsEntity, AddressEntity,AuctionEventEntity,NotificationEntity,NotificationGateway,AuthGuard,])],
  controllers: [OpenPhoneEventController],
  providers: [OpenPhoneEventService, AddressService,AuctionEventService,NotificationService,NotificationGateway,JwtService,ConfigService],
})
export class OpenPhoneEventModule {}
