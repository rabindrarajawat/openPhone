import { Body, Controller, Get, InternalServerErrorException, Post } from "@nestjs/common";
import { OpenPhoneEventTypeDTO } from "src/dto/open-phone-event-type.dto";
import { CustomLogger } from "src/service/logger.service";
import { OpenPhoneEventTypeService } from "src/service/open-phone-event-type.service";

@Controller("open-phone-event-type")
export class OpenPhoneEventTypeController {
  constructor(private readonly openPhoneEventService: OpenPhoneEventTypeService,
    private readonly logger:CustomLogger
  ) {}

  @Post()
  async createOpenPhoneEventType(@Body() openPhoneEventTypeDto: OpenPhoneEventTypeDTO) {
    try {
      const createdAddress = await this.openPhoneEventService.createOpenPhoneEventType(openPhoneEventTypeDto);
      this.logger.log('Open phone event type data saved successfully'); // Log success response
      return {
        message: 'Open phone event type data saved successfully',
        id: createdAddress.id,
      };
    } catch (error) {
      this.logger.error('Error in createOpenPhoneEventType:', error.message); // Log error details
      console.error('Error in createOpenPhoneEventType:', error); // Optional console log for debugging
      throw new InternalServerErrorException('Failed to create open phone event type');
    }
  }


  @Get()
  async getAllAddressData() {
    try {
      const data = await this.openPhoneEventService.findAll();
      this.logger.log(`Retrieved ${data.length} open phone event type records successfully`); // Log success response
      return data;
    } catch (error) {
      this.logger.error('Error in getAllAddressData:', error.message); // Log error details
      console.error('Error in getAllAddressData:', error); // Optional console log for debugging
      throw new InternalServerErrorException('Failed to get open phone event type data');
    }
  }
}
