import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    UseGuards,
  } from "@nestjs/common";
  import { RoleDto } from "../dto/role.dto";
  import { RoleService } from "../service/role.service";
  import { RoleEntity } from "../entities/role.entity";
  
  @Controller("")
  // @UseGuards(AuthGuard)
  export class RoleController {
    constructor(private readonly roleService: RoleService) {
      console.log("RoleController is being initialized.");
    }
  
    @Post("/addrole")
    async createRole(@Body() dto: RoleDto) {
      return await this.roleService.createRole(dto);  
    }
  
    @Get("/getrole")
  async getAllRoles(): Promise<RoleEntity[]> {
    return this.roleService.getRoles();
  }
  
    @Delete("/deleterole/:roleId")
    async deleteRole(@Param("roleId") roleId: string) {
      try {
        await this.roleService.deleteRole(roleId);
        return `Role deleted successfully ${roleId}`;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  