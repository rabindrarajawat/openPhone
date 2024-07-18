import { Body, Controller, Get, Post } from "@nestjs/common";
import { MessageMasterDto } from "src/dto/message-master.dto";
import { MessageMasterService } from "../service/message-master.service";

@Controller("message")
export class MessageMasterController {
  constructor(private readonly messageMasterService: MessageMasterService) {}

  @Post()
  async createMessage(@Body() messageMasterDto: MessageMasterDto) {
     const messageData =
    await this.messageMasterService.create(messageMasterDto);
     return {
      message: "Message data saved successfully",
      id: messageData.id,
    };
  }

  @Get()
  async getAllCaseEventData() {
    return this.messageMasterService.findAll();
  }
}
