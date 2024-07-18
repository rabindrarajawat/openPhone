import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressController } from "src/controller/address.controller";
import { AddressEntity } from "../entities/address.entity";
import { AddressService } from "src/service/address.service";

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AdressModule {}
