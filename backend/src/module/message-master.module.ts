import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageMasterController} from "../controller/message-master.controller";
import { MessageMasterService } from "../service/message-master.service";
import { MessageMasterEntity } from "../entities/message-template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MessageMasterEntity])],
  controllers: [MessageMasterController],
  providers: [MessageMasterService],
})
export class MessageMasterModule {}
