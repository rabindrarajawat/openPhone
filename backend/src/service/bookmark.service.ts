// bookmark.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookmarkEntity } from '../entities/bookmark.entity';
import { AddressEntity } from '../entities/address.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(BookmarkEntity)
    private bookmarkRepository: Repository<BookmarkEntity>,
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
  ) {}

  async bookmarkAddress(addressId: number): Promise<{ address_id: number; message: string }> {
    const address = await this.addressRepository.findOne({ where: { id: addressId } });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
  
    let bookmark = await this.bookmarkRepository.findOne({ where: { address_id: addressId } });
    if (bookmark) {
      await this.bookmarkRepository.remove(bookmark);
      return { address_id: bookmark.address_id, message: "Removed from bookmarked" };
    } else {
      bookmark = this.bookmarkRepository.create({ address_id: addressId });
      const savedBookmark = await this.bookmarkRepository.save(bookmark);
      return { address_id: savedBookmark.address_id, message: "Added to bookmarked" };
    }
  }

  async getBookmarkedAddresses(): Promise<AddressEntity[]> {
    const bookmarks = await this.bookmarkRepository.find();
    const addressIds = bookmarks.map(b => b.address_id);
    return this.addressRepository.findByIds(addressIds);
  }
}