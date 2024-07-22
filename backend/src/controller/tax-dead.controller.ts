import { Body, Controller, Get, Post } from "@nestjs/common";
import { AddressDto } from "src/dto/address.dto";
import { TaxDeadDto } from "src/dto/tax_dead.dto";
import { AddressService } from "src/service/address.service";
import { TaxDeadService } from "src/service/tax-dead.service";

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
