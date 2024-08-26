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

@Controller("bookmarks")
@UseGuards(AuthGuard)
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post(":addressId")
  async toggleBookmark(@Param("addressId") addressId: number) {
    try {
      return await this.bookmarkService.bookmarkAddress(addressId);
    } catch (error) {
      console.error("Error in toggleBookmark:", error);
      throw new InternalServerErrorException("Failed to toggle bookmark");
    }
  }

  @Get()
  async getBookmarkedAddresses() {
    try {
      return await this.bookmarkService.getBookmarkedAddresses();
    } catch (error) {
      console.error("Error in getBookmarkedAddresses:", error);
      throw new InternalServerErrorException(
        "Failed to get bookmarked addresses"
      );
    }
  }
}
