import { Body, Controller, Get, InternalServerErrorException, Post } from "@nestjs/common";
import { CaseEventDto } from "src/dto/case-event.dto";
import { CaseEventService } from "src/service/case-event.service";
import { CustomLogger } from "src/service/logger.service";

@Controller("case-event")
export class CaseEventController {
  constructor(private readonly caseEventService: CaseEventService,
    private readonly logger : CustomLogger
  ) {}

  @Post()
  async createCaseEventData(@Body() caseEventDto: CaseEventDto) {
    try {
      const caseEventData = await this.caseEventService.create(caseEventDto);
      this.logger.log(`Case event data saved successfully: ${JSON.stringify(caseEventData)}`); // Log successful response
      return {
        message: "Case event data saved successfully",
        id: caseEventData.id,
      };
    } catch (error) {
      this.logger.error("Error in createCaseEventData:", error.message); // Log the error details
      throw new InternalServerErrorException("Failed to create case event data");
    }
  }

  @Get()
  async getAllCaseEventData() {
    try {
      const caseEventData = await this.caseEventService.findAll();
      this.logger.log(`Fetched all case event data: ${JSON.stringify(caseEventData)}`); // Log successful response
      return caseEventData;
    } catch (error) {
      this.logger.error("Error in getAllCaseEventData:", error.message); // Log the error details
      throw new InternalServerErrorException("Failed to get all case event data");
    }
  }
}
