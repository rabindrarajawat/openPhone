import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageMasterController} from "../controller/message-master.controller";
import { MessageMasterService } from "../service/message-master.service";
import { MessageMasterEntity } from "../entities/message-template.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { CustomLogger } from "src/service/logger.service";

@Module({
  imports: [TypeOrmModule.forFeature([MessageMasterEntity])],
  controllers: [MessageMasterController],
  providers: [MessageMasterService,CustomLogger,JwtService,ConfigService],
})
export class MessageMasterModule {}
