import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AddressDto } from "src/dto/address.dto";
import { AddressService } from "src/service/address.service";

@Controller("address")
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  async createAddress(@Body() addressDto: AddressDto) {
    const createdAddress = await this.addressService.createAddress(addressDto);
    return {
      message: "Address Data saved successfully",
      id: createdAddress.id,
    };
  }

  @Get('getalladdress')
  async getAllAddressData() {
    const addressData = this.addressService.findAll();
    const filteredAddresses = (await addressData).filter(
      (address) => address?.is_active === true
    );
    return filteredAddresses;
  }

  // @Get("details")
  // async getAddressDetails(@Query("address") address: string) {
  //   const addressDetails = await this.addressService.findByAddress(address);
  //   return addressDetails;
  // }





  @Get('search')
  async searchAddresses(@Query('term') searchTerm: string) {
    if (!searchTerm || searchTerm.length < 2) {
      return { results: [] };
    }
    const addresses = await this.addressService.searchAddresses(searchTerm);
    return {
      results: addresses.map(address => ({
        // id: address.id,
        fullAddress: address.address,
        // name: address.name,
        // Add any other fields you want to return
      }))
    };
  }











}
