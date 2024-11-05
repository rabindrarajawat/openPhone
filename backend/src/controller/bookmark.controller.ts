//  import { Controller, Post, Get, Param } from '@nestjs/common';
// import { BookmarkService } from '../service/bookmark.service';

// @Controller('bookmarks')
// export class BookmarkController {
//   constructor(private bookmarkService: BookmarkService) {}

//   @Post(':addressId')
//   async toggleBookmark(@Param('addressId') addressId: number) {
//     const bookmarked = await this.bookmarkService.bookmarkAddress(addressId);
//      return bookmarked
//   }

//   @Get()
//   async getBookmarkedAddresses() {
//     return this.bookmarkService.getBookmarkedAddresses();
//   }
// }

import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  InternalServerErrorException,
} from "@nestjs/common";
import { BookmarkService } from "../service/bookmark.service";
import { AuthGuard } from "../authguard/auth.guard";
import { CustomLogger } from "src/service/logger.service";

@Controller("bookmarks")
@UseGuards(AuthGuard)
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService,
    private readonly logger : CustomLogger
  ) {}

  @Post(":addressId")
  async toggleBookmark(@Param("addressId") addressId: number) {
    try {
      const result = await this.bookmarkService.bookmarkAddress(addressId);
      this.logger.log(`Bookmark toggled successfully for addressId: ${addressId}`); // Log successful response
      return result;
    } catch (error) {
      this.logger.error("Error in toggleBookmark:", error.message); // Log the error details
      console.error("Error in toggleBookmark:", error); // Keep console error logging if needed
      throw new InternalServerErrorException("Failed to toggle bookmark");
    }
  }

  @Get()
  async getBookmarkedAddresses() {
    try {
      const addresses = await this.bookmarkService.getBookmarkedAddresses();
      this.logger.log(`Successfully fetched bookmarked addresses: ${JSON.stringify(addresses)}`); // Log successful response
      return addresses;
    } catch (error) {
      this.logger.error("Error in getBookmarkedAddresses:", error.message); // Log the error details
      console.error("Error in getBookmarkedAddresses:", error); // Keep console error logging if needed
      throw new InternalServerErrorException(
        "Failed to get bookmarked addresses"
      );
    }
  }
}
