import { Body, Controller, Get, InternalServerErrorException, Post } from "@nestjs/common";
import { AuctionEventDto } from "src/dto/auction-event.dto";
import { AuctionEventService } from "src/service/auction-event.service";
import { CustomLogger } from "src/service/logger.service";

@Controller("auction-event")
export class AuctionEventController {
  constructor(private readonly auctionEventService: AuctionEventService,
    private readonly logger: CustomLogger
  ) {}

  @Post()
  async createAddress(@Body() addressDto: AuctionEventDto) {
    try {
      const createdAddress = await this.auctionEventService.create(addressDto);
      this.logger.log(`Auction event data saved successfully: ${createdAddress.id}`); // Log the successful response
      return {
        message: "Auction event data saved successfully",
        id: createdAddress.id,
      };
    } catch (error) {
      this.logger.error("Error in createAddress:", error.message); // Log the error details
      throw new InternalServerErrorException("Failed to create auction event");
    }
  }

  @Get()
  async getAllAddressData() {
    try {
      const data = await this.auctionEventService.findAll();
      this.logger.log(`Fetched all auction events successfully. Total count: ${data.length}`); // Log the successful response
      return data;
    } catch (error) {
      this.logger.error("Error in getAllAddressData:", error.message); // Log the error details
      throw new InternalServerErrorException("Failed to fetch all auction events");
    }
  }
}
