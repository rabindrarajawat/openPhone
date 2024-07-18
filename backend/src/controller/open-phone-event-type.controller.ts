import { Body, Controller, Get, Post } from "@nestjs/common";
import { OpenPhoneEventTypeDTO } from "src/dto/open-phone-event-type.dto";
import { OpenPhoneEventTypeService } from "src/service/open-phone-event-type.service";

@Controller("open-phone-event-type")
export class OpenPhoneEventTypeController {
  constructor(private readonly openPhoneEventService: OpenPhoneEventTypeService) {}

  @Post()
  async createOpenPhoneEventType(@Body() openPhoneEventTypeDto: OpenPhoneEventTypeDTO) {
    const createdAddress = await this.openPhoneEventService.createOpenPhoneEventType(openPhoneEventTypeDto);
    return {
      message: "Open phone event type data saved successfully",
      id: createdAddress.id,
    };
  }

  @Get()
  async getAllAddressData() {
    return this.openPhoneEventService.findAll();
  }
}
