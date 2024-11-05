import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CaseEventController} from "../controller/case-event.controller";
import { CaseEventEntity } from "../entities/case-event.entity";
import { CaseEventService } from "../service/case-event.service";
import { CustomLogger } from "src/service/logger.service";

@Module({
  imports: [TypeOrmModule.forFeature([CaseEventEntity])],
  controllers: [CaseEventController],
  providers: [CaseEventService,CustomLogger],
})
export class CaseEventModule {}
