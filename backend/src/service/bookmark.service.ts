// // bookmark.service.ts
// import { Injectable, NotFoundException } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { BookmarkEntity } from "../entities/bookmark.entity";
// import { AddressEntity } from "../entities/address.entity";

// @Injectable()
// export class BookmarkService {
//   constructor(
//     @InjectRepository(BookmarkEntity)
//     private bookmarkRepository: Repository<BookmarkEntity>,
//     @InjectRepository(AddressEntity)
//     private addressRepository: Repository<AddressEntity>
//   ) {}

//   async bookmarkAddress(
//     addressId: number
//   ): Promise<{ address_id: number; message: string }> {
//     const address = await this.addressRepository.findOne({
//       where: { id: addressId },
//     });
//     if (!address) {
//       throw new NotFoundException("Address not found");
//     }
//     address.is_bookmarked = !address.is_bookmarked;
//     const updatedData = await this.addressRepository.save(address);
//     if (updatedData.is_bookmarked) {
//       return { address_id: updatedData.id, message: "Added to bookmarked" };
//     } else {
//       return { address_id: updatedData.id, message: "Removed from bookmarked" };
//     }
//   }

//   async getBookmarkedAddresses(): Promise<AddressEntity[]> {
//     const bookmarks = await this.bookmarkRepository.find();
//     const addressIds = bookmarks.map((b) => b.address_id);
//     return this.addressRepository.findByIds(addressIds);
//   }
// }

import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BookmarkEntity } from "../entities/bookmark.entity";
import { AddressEntity } from "../entities/address.entity";

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(BookmarkEntity)
    private bookmarkRepository: Repository<BookmarkEntity>,
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>
  ) {}

  async bookmarkAddress(
    addressId: number
  ): Promise<{ address_id: number; message: string }> {
    try {
      const address = await this.addressRepository.findOne({
        where: { id: addressId },
      });
      if (!address) {
        throw new NotFoundException("Address not found");
      }
      address.is_bookmarked = !address.is_bookmarked;
      const updatedData = await this.addressRepository.save(address);
      if (updatedData.is_bookmarked) {
        return { address_id: updatedData.id, message: "Added to bookmarked" };
      } else {
        return {
          address_id: updatedData.id,
          message: "Removed from bookmarked",
        };
      }
    } catch (error) {
      console.error("Error in bookmarkAddress:", error);
      throw new InternalServerErrorException("Failed to bookmark address");
    }
  }

  async getBookmarkedAddresses(): Promise<AddressEntity[]> {
    try {
      const bookmarks = await this.bookmarkRepository.find();
      const addressIds = bookmarks.map((b) => b.address_id);
      return this.addressRepository.findByIds(addressIds);
    } catch (error) {
      console.error("Error in getBookmarkedAddresses:", error);
      throw new InternalServerErrorException(
        "Failed to get bookmarked addresses"
      );
    }
  }
}
