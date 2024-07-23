import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
 import { OpenPhoneEventDirectionController } from "src/controller/open-phone-event-direction.controller";
 import { OpenPhoneEventDirectionEntity } from "src/entities/open-phone-event-direction.entity";
 import { OpenPhoneEventDirectionService } from "src/service/open-phone-event-direction.service";

@Module({
  imports: [TypeOrmModule.forFeature([OpenPhoneEventDirectionEntity])],
  controllers: [OpenPhoneEventDirectionController],
  providers: [OpenPhoneEventDirectionService],
})
export class OpenPhoneEventDirectionModule {}
