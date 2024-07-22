import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
 import { OpenPhoneEventDirectionController } from "../controller/open-phone-event-direction.controller";
 import { OpenPhoneEventDirectionEntity } from "../entities/open-phone-event-direction.entity";
 import { OpenPhoneEventDirectionService } from "../service/open-phone-event-direction.service";

@Module({
  imports: [TypeOrmModule.forFeature([OpenPhoneEventDirectionEntity])],
  controllers: [OpenPhoneEventDirectionController],
  providers: [OpenPhoneEventDirectionService],
})
export class OpenPhoneEventDirectionModule {}
