import { Body, Controller, Get, Post } from "@nestjs/common";
import { AddressDto } from "src/dto/address.dto";
import { TaxDeadDto } from "src/dto/tax_dead.dto";
import { AddressService } from "src/service/address.service";
import { TaxDeadService } from "src/service/tax-dead.service";
import { CustomLogger } from "src/service/logger.service";
import { HttpException, HttpStatus } from '@nestjs/common';


@Controller("tax-dead")
export class TaxDeadController {
  constructor(private readonly taxDeadService: TaxDeadService ,
    private readonly logger: CustomLogger
  ) {}

  @Post()
  async createTaxDead(@Body() taxDeadDto: TaxDeadDto) {
    this.logger.log(`Attempting to create tax dead data with: ${JSON.stringify(taxDeadDto)}`);
    try {
      const taxDeadData = await this.taxDeadService.create(taxDeadDto);
      this.logger.log(`Tax dead data saved successfully with ID: ${taxDeadData.id}`);
      return {
        message: "Tax dead data saved successfully",
        id: taxDeadData.id,
      };
    } catch (error) {
      this.logger.error(`Error saving tax dead data: ${error.message}`, error.stack);
      throw new HttpException("Failed to save tax dead data", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getAllAddressData() {
    this.logger.log("Fetching all address data");
    try {
      const addressData = await this.taxDeadService.findAll();
      this.logger.log(`Successfully fetched address data: ${JSON.stringify(addressData)}`);
      return addressData;
    } catch (error) {
      this.logger.error(`Error fetching address data: ${error.message}`, error.stack);
      throw new HttpException("Failed to fetch address data", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
