import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CaseEventController} from "../controller/case-event.controller";
import { CaseEventEntity } from "../entities/case-event.entity";
import { CaseEventService } from "../service/case-event.service";

@Module({
  imports: [TypeOrmModule.forFeature([CaseEventEntity])],
  controllers: [CaseEventController],
  providers: [CaseEventService],
})
export class CaseEventModule {}
