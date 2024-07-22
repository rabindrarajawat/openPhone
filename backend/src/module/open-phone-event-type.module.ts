import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressController } from "../controller/address.controller";
import { OpenPhoneEventTypeController } from "../controller/open-phone-event-type.controller";
import { AddressEntity } from "../entities/address.entity";
import { OpenPhoneEventTypeEntity } from "../entities/open-phone-event-type.entity";
import { AddressService } from "../service/address.service";
import { OpenPhoneEventTypeService } from "../service/open-phone-event-type.service";

@Module({
  imports: [TypeOrmModule.forFeature([OpenPhoneEventTypeEntity])],
  controllers: [OpenPhoneEventTypeController],
  providers: [OpenPhoneEventTypeService],
})
export class OpenPhoneEventTypeModule {}
