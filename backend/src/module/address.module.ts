import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressController } from "src/controller/address.controller";
import { AddressEntity } from "../entities/address.entity";
import { AddressService } from "src/service/address.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { OpenPhoneEventEntity } from "src/entities/open-phone-event.entity";
import { CustomLogger } from "src/service/logger.service";

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity,OpenPhoneEventEntity])],
  controllers: [AddressController],
  providers: [AddressService,JwtService,ConfigService,CustomLogger],
})
export class AdressModule {}
