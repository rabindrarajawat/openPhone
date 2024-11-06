import { Body, Controller, Get, InternalServerErrorException, Post, UseGuards } from "@nestjs/common";
import { MessageMasterDto } from "src/dto/message-master.dto";
import { MessageMasterService } from "../service/message-master.service";
import { AuthGuard } from "src/authguard/auth.guard";
import { CustomLogger } from "src/service/logger.service";

@Controller("message")
@UseGuards(AuthGuard)
export class MessageMasterController {
  constructor(private readonly messageMasterService: MessageMasterService,
    private readonly logger : CustomLogger
  ) {}

  @Post()
  async createMessage(@Body() messageMasterDto: MessageMasterDto) {
    try {
      const messageData = await this.messageMasterService.create(messageMasterDto);
      this.logger.log(`Message created successfully: id=${messageData.id}`); // Log success response
      return {
        message: "Message data saved successfully",
        id: messageData.id,
      };
    } catch (error) {
      this.logger.error('Error in createMessage:', error.message); // Log error details
      console.error('Error in createMessage:', error); // Optional: Log to console for debugging
      throw new InternalServerErrorException('Failed to create message data');
    }
  }
  @Get()
  async getAllCaseEventData() {
    try {
      const data = await this.messageMasterService.findAll();
      this.logger.log(`Retrieved ${data.length} case event data records successfully`); // Log success response
      return data;
    } catch (error) {
      this.logger.error('Error in getAllCaseEventData:', error.message); // Log error details
      console.error('Error in getAllCaseEventData:', error); // Optional: Log to console for debugging
      throw new InternalServerErrorException('Failed to get all case event data');
    }
  }
}
