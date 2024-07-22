import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuctionEventDto } from "../dto/auction-event.dto";
import { AuctionEventService } from "../service/auction-event.service";

@Controller("auction-event")
export class AuctionEventController {
  constructor(private readonly auctionEventService: AuctionEventService) {}

  @Post()
  async createAddress(@Body() addressDto: AuctionEventDto) {
    const createdAddress = await this.auctionEventService.create(addressDto);
    return {
      message: "Auction event data saved successfully",
      id: createdAddress.id,
    };
  }

  @Get()
  async getAllAddressData() {
    return this.auctionEventService.findAll();
  }
}
