import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressController } from "../controller/address.controller";
import { AddressEntity } from "../entities/address.entity";
import { AddressService } from "../service/address.service";

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AdressModule {}
