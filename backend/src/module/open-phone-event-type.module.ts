import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressController } from "src/controller/address.controller";
import { OpenPhoneEventTypeController } from "src/controller/open-phone-event-type.controller";
import { AddressEntity } from "src/entities/address.entity";
import { OpenPhoneEventTypeEntity } from "src/entities/open-phone-event-type.entity";
import { AddressService } from "src/service/address.service";
import { OpenPhoneEventTypeService } from "src/service/open-phone-event-type.service";

@Module({
  imports: [TypeOrmModule.forFeature([OpenPhoneEventTypeEntity])],
  controllers: [OpenPhoneEventTypeController],
  providers: [OpenPhoneEventTypeService],
})
export class OpenPhoneEventTypeModule {}
