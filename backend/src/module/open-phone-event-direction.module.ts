import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
 import { OpenPhoneEventDirectionController } from "src/controller/open-phone-event-direction.controller";
 import { OpenPhoneEventDirectionEntity } from "src/entities/open-phone-event-direction.entity";
import { CustomLogger } from "src/service/logger.service";
 import { OpenPhoneEventDirectionService } from "src/service/open-phone-event-direction.service";

@Module({
  imports: [TypeOrmModule.forFeature([OpenPhoneEventDirectionEntity])],
  controllers: [OpenPhoneEventDirectionController],
  providers: [OpenPhoneEventDirectionService,CustomLogger],
})
export class OpenPhoneEventDirectionModule {}
