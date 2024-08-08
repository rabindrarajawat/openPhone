// import { Module } from "@nestjs/common";
// import { TypeOrmModule } from "@nestjs/typeorm";
// import { conversationmapping } from "src/entities/conversation-mapping.entity";
// import { ConversationMapingController } from "src/controller/conversation-mapping.controller";
// import { ConversationMapingService } from "src/service/conversation-mapping.service";
// import { AddressService } from "src/service/address.service";
// import { AddressEntity } from "src/entities/address.entity";

// @Module({
//     imports: [TypeOrmModule.forFeature([AddressEntity, conversationmapping])],
//     controllers: [ConversationMapingController],
//     providers: [ConversationMapingService, AddressService],
// })
// export class ConversationMappingModule { }

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { conversationmapping } from "src/entities/conversation-mapping.entity";
import { AddressEntity } from "src/entities/address.entity";
import { OpenPhoneEventEntity } from "src/entities/open-phone-event.entity";
import { ConversationMapingController } from "src/controller/conversation-mapping.controller";
import { ConversationMapingService } from "src/service/conversation-mapping.service";
import { AddressService } from "src/service/address.service";
import { OpenPhoneEventService } from "src/service/open-phone-event.service";
import { AuctionEventEntity } from "src/entities/auction-event.entity";
import { AuctionEventService } from "src/service/auction-event.service";
import { NotificationService } from "src/service/notification.service";
import { NotificationEntity } from "src/entities/notification.entity";
import { NotificationGateway } from "src/gateways/notification.gateway";

@Module({
    imports: [
        TypeOrmModule.forFeature([AddressEntity, conversationmapping, OpenPhoneEventEntity, AuctionEventEntity,NotificationGateway,NotificationEntity])
    ],
    controllers: [ConversationMapingController],
    providers: [ConversationMapingService, OpenPhoneEventService, AddressService, AuctionEventService,NotificationService,NotificationGateway],
})
export class ConversationMappingModule { }
