import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { MessageMasterDto } from "src/dto/message-master.dto";
import { MessageMasterService } from "../service/message-master.service";
import { AuthGuard } from "src/authguard/auth.guard";

@Controller("message")
@UseGuards(AuthGuard)
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
