// role.module.ts

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
 import { BookmarkController } from "src/controller/bookmark.controller";
import { BookmarkService } from "src/service/bookmark.service";
import { BookmarkEntity } from "src/entities/bookmark.entity";
import { AddressEntity } from "src/entities/address.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { CustomLogger } from "src/service/logger.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([BookmarkEntity,AddressEntity]), 
  ],
  providers: [BookmarkService,JwtService,ConfigService,CustomLogger],
  controllers: [BookmarkController], 
})
export class BookmarkModule {}
