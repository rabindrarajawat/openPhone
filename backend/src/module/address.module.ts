import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressController } from "src/controller/address.controller";
import { AddressEntity } from "../entities/address.entity";
import { AddressService } from "src/service/address.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { OpenPhoneEventEntity } from "src/entities/open-phone-event.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity,OpenPhoneEventEntity])],
  controllers: [AddressController],
  providers: [AddressService,JwtService,ConfigService],
})
export class AdressModule {}
