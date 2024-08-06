 import { Controller, Post, Get, Param } from '@nestjs/common';
import { BookmarkService } from '../service/bookmark.service';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post(':addressId')
  async toggleBookmark(@Param('addressId') addressId: number) {
    const bookmarked = await this.bookmarkService.bookmarkAddress(addressId);
     return bookmarked
  }

  @Get()
  async getBookmarkedAddresses() {
    return this.bookmarkService.getBookmarkedAddresses();
  }
}