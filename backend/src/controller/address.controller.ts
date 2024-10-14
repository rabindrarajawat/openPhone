// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   Post,
//   Query,
//   UseGuards,
// } from "@nestjs/common";
// import { AuthGuard } from "src/authguard/auth.guard";
// import { AddressDto } from "src/dto/address.dto";
// import { AddressService } from "src/service/address.service";

// @Controller("address")
// export class AddressController {
//   constructor(private readonly addressService: AddressService) {}

//   @Post()
//   async createAddress(@Body() addressDto: AddressDto) {
//     const createdAddress = await this.addressService.createAddress(addressDto);
//     return {
//       message: "Address Data saved successfully",
//       id: createdAddress,
//     };
//   }

//   @Get("getalladdress")
//   async getAllAddressData() {
//     const addressData = this.addressService.findAll();
//     const filteredAddresses = (await addressData).filter(
//       (address) => address?.is_active === true
//     );
//     return filteredAddresses;
//   }

//   @Get("search")
//   async searchAddresses(@Query("address") searchTerm: string) {
//     if (!searchTerm || searchTerm.length < 2) {
//       return { results: [] };
//     }
//     const addresses = await this.addressService.searchAddresses(searchTerm);
//     return {
//       results: addresses.map((address) => ({
//         fullAddress: address.address,
//       })),
//     };
//   }

//   @Get("getaddressid")
//   async getAddressId(@Query("address") address: string) {
//     const addressId = await this.addressService.getAddressIdByAddress(address);
//     if (addressId !== null) {
//       return { addressId };
//     } else {
//       return { message: "Address not found" };
//     }
//   }
// }

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  InternalServerErrorException,
} from "@nestjs/common";
import { AuthGuard } from "../authguard/auth.guard";
import { AddressDto } from "../dto/address.dto";
import { AddressService } from "../service/address.service";

@Controller("address")
@UseGuards(AuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async createAddress(@Body() addressDto: AddressDto) {
    try {
      const createdAddress =
        await this.addressService.createAddress(addressDto);
      return {
        message: "Address Data saved successfully",
        id: createdAddress,
      };
    } catch (error) {
      console.error("Error in createAddress:", error);
      throw new InternalServerErrorException("Failed to create address");
    }
  }

  @Get("getalladdress")
  async getAllAddressData() {
    try {
      const addressData = await this.addressService.findAll();
      const filteredAddresses = addressData.filter(
        (address) => address?.is_active === true
      );
      return filteredAddresses;
    } catch (error) {
      console.error("Error in getAllAddressData:", error);
      throw new InternalServerErrorException("Failed to get all address data");
    }
  }

  @Get("search")
  async searchAddresses(@Query("address") searchTerm: string) {
    try {
      if (!searchTerm || searchTerm.length < 2) {
        return { results: [] };
      }
      const addresses = await this.addressService.searchAddresses(searchTerm);
      return {
        results: addresses.map((address) => ({
          fullAddress: address.address,
        })),
      };
    } catch (error) {
      console.error("Error in searchAddresses:", error);
      throw new InternalServerErrorException("Failed to search addresses");
    }
  }

  @Get("getaddressid")
  async getAddressId(@Query("address") address: string) {
    try {
      const addressId =
        await this.addressService.getAddressIdByAddress(address);
      if (addressId !== null) {
        return { addressId };
      } else {
        return { message: "Address not found" };
      }
    } catch (error) {
      console.error("Error in getAddressId:", error);
      throw new InternalServerErrorException("Failed to get address ID");
    }
  }
}
