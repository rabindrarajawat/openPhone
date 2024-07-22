import { Body, Controller, Get, Post } from "@nestjs/common";
import { AddressDto } from "../dto/address.dto";
import { TaxDeadDto } from "../dto/tax_dead.dto";
import { AddressService } from "../service/address.service";
import { TaxDeadService } from "../service/tax-dead.service";

@Controller("tax-dead")
export class TaxDeadController {
  constructor(private readonly taxDeadService: TaxDeadService) {}

  @Post()
  async createTaxDead(@Body() taxDeadDto: TaxDeadDto) {
    const taxDeadData = await this.taxDeadService.create(taxDeadDto);
    return {
      message: "Tax dead data saved successfully",
      id: taxDeadData.id,
    };
  }

  @Get()
  async getAllAddressData() {
    return this.taxDeadService.findAll();
  }
}
