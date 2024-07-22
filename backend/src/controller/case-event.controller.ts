import { Body, Controller, Get, Post } from "@nestjs/common";
import { CaseEventDto } from "../dto/case-event.dto";
import { CaseEventService } from "../service/case-event.service";

@Controller("case-event")
export class CaseEventController {
  constructor(private readonly caseEventService: CaseEventService) {}

  @Post()
  async createCaseEventData(@Body() caseEventDto: CaseEventDto) {
     const caseEventData =
    await this.caseEventService.create(caseEventDto);
     return {
      message: "Case event data saved successfully",
      id: caseEventData.id,
    };
  }

  @Get()
  async getAllCaseEventData() {
    return this.caseEventService.findAll();
  }
}
