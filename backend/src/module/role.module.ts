// role.module.ts

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleEntity } from "../entities/role.entity";
import { RoleService } from "../service/role.service";
import { RoleController } from "../controller/role.controller";
import { CustomLogger } from "src/service/logger.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity]), // Import RoleEntity into TypeOrmModule
  ],
  providers: [RoleService,CustomLogger],
  controllers: [RoleController], // Register RoleController here
})
export class RoleModule {}
