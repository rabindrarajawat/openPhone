import { Body, Controller, Get, Post } from "@nestjs/common";
import { CaseEventDto } from "src/dto/case-event.dto";
import { CaseEventService } from "src/service/case-event.service";

@Controller("case-event")
export class CaseEventController {
  constructor(private readonly caseEventService: CaseEventService) {}

  @Post()
  async createCaseEventData(@Body() caseEventDto: CaseEventDto) {
    console.log("🚀 ~ CaseEventController ~ createCaseEventData ~ caseEventDto:", caseEventDto)
    const caseEventData =
    await this.caseEventService.create(caseEventDto);
    console.log("🚀 ~ CaseEventController ~ createCaseEventData ~ caseEventData:", caseEventData)
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
