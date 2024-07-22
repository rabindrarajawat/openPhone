import { Body, Controller, Get, Post } from "@nestjs/common";
import { AddressDto } from "../dto/address.dto";
import { AddressService } from "../service/address.service";

@Controller("address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async createAddress(@Body() addressDto: AddressDto) {
    const createdAddress = await this.addressService.createAddress(addressDto);
    return {
      message: "Address Data saved successfully",
      id: createdAddress.id,
    };
  }

  @Get()
  async getAllAddressData() {
    return this.addressService.findAll();
  }
}
