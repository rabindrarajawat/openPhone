import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { conversationmapping } from "src/entities/conversation-mapping.entity";
import { ConversationMapingController } from "src/controller/conversation-mapping.controller";
import { ConversationMapingService } from "src/service/conversation-mapping.service";
import { AddressService } from "src/service/address.service";
import { AddressEntity } from "src/entities/address.entity";

@Module({
    imports: [TypeOrmModule.forFeature([AddressEntity, conversationmapping])],
    controllers: [ConversationMapingController],
    providers: [ConversationMapingService, AddressService],
})
export class ConversationMappingModule { }
