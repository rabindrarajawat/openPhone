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

  // @Get("getalladdress")
  // async getAllAddressData() {
  //   try {
  //     const addressData = await this.addressService.findAll();
  //     const filteredAddresses = addressData.filter(
  //       (address) => address?.is_active === true
  //     );
  //     return filteredAddresses;
  //   } catch (error) {
  //     console.error("Error in getAllAddressData:", error);
  //     throw new InternalServerErrorException("Failed to get all address data");
  //   }
  // }




// With server side pagination
  @Get("getalladdress")
  async getAllAddressData(
    @Query("page") page: number,
    @Query("limit") limit: number
  ) {
    try {
      // Set default values for pagination if not provided
      page = page && page > 0 ? page : 1;
      limit = limit && limit > 0 ? limit : 10;

      const { data, totalCount } = await this.addressService.findAll(
        page,
        limit
      );
      return {
        data,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    } catch (error) {
      console.error("Error in getAllAddressData:", error);
      throw new InternalServerErrorException("Failed to get all address data");
    }
  }




//Working filter for auction type id 
  // @Get("getalladdress")
  // async getAllAddressData(
  //   @Query("page") page: number,
  //   @Query("limit") limit: number,
  //   @Query("auctionEventId") auctionEventId: number, // Now using event ID instead of text
  //   @Query("date") date: string,
  //   @Query("address") address: string
  // ) {
  //   try {
  //     // Set default values for pagination if not provided
  //     page = page && page > 0 ? page : 1;
  //     limit = limit && limit > 0 ? limit : 10;

  //     const { data, totalCount } = await this.addressService.findAll(
  //       page,
  //       limit,
  //       auctionEventId,
  //       date,
  //       address
  //     );
  //     return {
  //       data,
  //       totalCount,
  //       currentPage: page,
  //       totalPages: Math.ceil(totalCount / limit),
  //     };
  //   } catch (error) {
  //     console.error("Error in getAllAddressData:", error);
  //     throw new InternalServerErrorException("Failed to get all address data");
  //   }
  // }





  @Get("with-responses")
  async getAddressesWithResponses() {
    const data = await this.addressService.getAddressesWithResponses();
    // const mappedData = data.map((item) => {
    //   const {
    //     modified_at,
    //     created_by,
    //     modified_by,
    //     is_active,
    //     is_bookmarked,
    //     events,
    //     ...rest
    //   } = item;
    //   return rest;
    // });
    return { Count: data.length, data: data };
  }

  @Get("with-stop-responses")
  async getAddressesWithStopResponses() {
    const stopRes = await this.addressService.getAddressesWithStopResponses();

    // const res = stopRes.map((item) => {
    //   const {
    //     created_at,
    //     created_by,
    //     modified_at,
    //     modified_by,
    //     is_active,
    //     is_bookmarked,
    //     date,
    //     events,
    //     ...rest
    //   } = item;
    //   return rest;
    // });
    return stopRes;
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
