// role.module.ts

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleEntity } from "../entities/role.entity";
import { RoleService } from "../service/role.service";
import { RoleController } from "../controller/role.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity]), // Import RoleEntity into TypeOrmModule
  ],
  providers: [RoleService],
  controllers: [RoleController], // Register RoleController here
})
export class RoleModule {}
