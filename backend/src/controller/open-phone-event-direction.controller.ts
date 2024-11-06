import { Body, Controller, Get, InternalServerErrorException, Post } from "@nestjs/common";
import { OpenPhoneEventDirectionDTO } from "src/dto/open-phone-event-direction.dto";
import { CustomLogger } from "src/service/logger.service";
import { OpenPhoneEventDirectionService } from "src/service/open-phone-event-direction.service";

@Controller("open-phone-event-direction")
export class OpenPhoneEventDirectionController {
  constructor(private readonly openPhoneEventDirectionService: OpenPhoneEventDirectionService,
    private readonly logger:CustomLogger
  ) {}

  @Post()
  async createOpenPhoneEventType(@Body() openPhoneEventDirectionDto: OpenPhoneEventDirectionDTO) {
    try {
      const createdAddress = await this.openPhoneEventDirectionService.createOpenPhoneEventType(openPhoneEventDirectionDto);
      this.logger.log('Open phone event direction data created successfully'); // Log success response
      return {
        message: 'Open phone event direction data saved successfully',
        id: createdAddress.id,
      };
    } catch (error) {
      this.logger.error('Error in createOpenPhoneEventType:', error.message); // Log error details
      console.error('Error in createOpenPhoneEventType:', error); // Optional: Log to console for debugging
      throw new InternalServerErrorException('Failed to create open phone event direction');
    }
  }

  @Get()
  async getAllAddressData() {
    try {
      const data = await this.openPhoneEventDirectionService.findAll();
      this.logger.log(`Retrieved ${data.length} open phone event direction records successfully`); // Log success response
      return data;
    } catch (error) {
      this.logger.error('Error in getAllAddressData:', error.message); // Log error details
      console.error('Error in getAllAddressData:', error); // Optional: Log to console for debugging
      throw new InternalServerErrorException('Failed to get open phone event direction data');
    }
  }
}
