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
// import { AddressService } from "../service/address.service";
import {
  AddressService,
  AddressWithConversations,
} from "../service/address.service";

interface AddressResponse {
  message: string;
  data: AddressWithConversations[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
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

  //with modified working filter
  // @Get("getalladdress")
  // async getAllAddressData(
  //   @Query("page") page: number,
  //   @Query("limit") limit: number,
  //   @Query("auctionEventId") auctionEventId?: number,
  //   @Query("filterType") filterType?: string,
  //   @Query("fromDate") fromDate?: string,
  //   @Query("toDate") toDate?: string,
  //   @Query("withResponses") withResponses?: boolean,
  //   @Query("withStopResponses") withStopResponses?: boolean,
  //   @Query("sortBy") sortBy: string = "modified_at",
  //   @Query("sortOrder") sortOrder: 'ASC' | 'DESC' = 'DESC'
  // ) {
  //   try {
  //     page = page && page > 0 ? page : 1;
  //     limit = limit && limit > 0 ? limit : 10;

  //     const { data, totalCount } = await this.addressService.findAll(
  //       page,
  //       limit,
  //       auctionEventId,
  //       filterType,
  //       fromDate,
  //       toDate,
  //       withResponses,
  //       withStopResponses,
  //       sortBy,
  //       sortOrder
  //     );

  //     if (data.length === 0) {
  //       return {
  //         message: "No results found",
  //         data: [],
  //         totalCount: 0,
  //         currentPage: page,
  //         totalPages: 0,
  //       };
  //     }

  //     return {
  //       message: "Success",
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

  @Get("getalladdress")
  async getAllAddressData(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("auctionEventId") auctionEventId?: string,
    @Query("filterType") filterType?: string,
    @Query("fromDate") fromDate?: string,
    @Query("toDate") toDate?: string,
    @Query("withResponses") withResponses?: boolean,
    @Query("withStopResponses") withStopResponses?: boolean,
    @Query("sortBy") sortBy: string = "modified_at",
    @Query("sortOrder") sortOrder: "ASC" | "DESC" = "DESC",
    @Query("isBookmarked") isBookmarked?: boolean,
    @Query("searchTerm") searchTerm?: string,
    @Query("eventTypeIds") eventTypeIds?: string
  ) {
    try {
      const parsedEventTypeIds = eventTypeIds
        ? JSON.parse(eventTypeIds)
        : undefined;

      const parsedAuctionEventIds = auctionEventId
        ? JSON.parse(auctionEventId)
        : undefined;

      page = page && page > 0 ? page : 1;
      limit = limit && limit > 0 ? limit : 10;

      const { data, totalCount } = await this.addressService.findAll(
        page,
        limit,
        parsedAuctionEventIds,
        filterType,
        fromDate,
        toDate,
        withResponses,
        withStopResponses,
        sortBy,
        sortOrder,
        isBookmarked,
        searchTerm,
        parsedEventTypeIds
      );

      return {
        message: data.length > 0 ? "Success" : "No results found",
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

  @Get("with-responses")
  async getAddressesWithResponses(
    @Query("page") page: number = 1, // Default page is 1
    @Query("limit") limit: number = 10 // Default limit is 10
  ) {
    // Set default values for pagination if not provided
    page = page && page > 0 ? page : 1;
    limit = limit && limit > 0 ? limit : 10;

    const [data, totalCount] =
      await this.addressService.getAddressesWithResponses(page, limit);

    return {
      totalCount, // Total number of entries
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      data, // Paginated data
    };
  }

  @Get("with-stop-responses")
  async getAddressesWithStopResponses(
    @Query("page") page: number = 1, // Default page is 1
    @Query("limit") limit: number = 10 // Default limit is 10
  ) {
    // Ensure valid page and limit values
    page = page && page > 0 ? page : 1;
    limit = limit && limit > 0 ? limit : 10;

    try {
      const [data, totalCount] =
        await this.addressService.getAddressesWithStopResponses(page, limit);

      return {
        totalCount, // Total number of entries
        currentPage: page, // Current page
        totalPages: Math.ceil(totalCount / limit), // Calculate total pages
        data, // Paginated data
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "An error occurred while fetching the data.",
        error: error.message || "Internal Server Error",
      };
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
