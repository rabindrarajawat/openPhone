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
  import {CustomLogger} from "src/service/logger.service"
  
  @Controller("")
  // @UseGuards(AuthGuard)
  export class RoleController {
    constructor(private readonly roleService: RoleService,
      private readonly logger:CustomLogger
    ) {
      console.log("RoleController is being initialized.");
    }
  
    @Post("/addrole")
    async createRole(@Body() dto: RoleDto) {
      this.logger.log(`Creating role with data: ${JSON.stringify(dto)}`);
      try {
        const role = await this.roleService.createRole(dto);
        this.logger.log(`Role created successfully: ${JSON.stringify(role)}`);
        return role;  
      } catch (error) {
        this.logger.error(`Error creating role: ${error.message}`, error.stack);
        throw new HttpException("Failed to create role", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Get("/getrole")
  async getAllRoles(): Promise<RoleEntity[]> {
    this.logger.log("Fetching all roles");
    try {
      const roles = await this.roleService.getRoles();
      this.logger.log(`Roles fetched successfully: ${JSON.stringify(roles)}`);
      return roles;
    } catch (error) {
      this.logger.error(`Error fetching roles: ${error.message}`, error.stack);
      throw new HttpException("Failed to fetch roles", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
  @Delete("/deleterole/:roleId")
  async deleteRole(@Param("roleId") roleId: string) {
    this.logger.log(`Deleting role with ID: ${roleId}`);
    try {
      await this.roleService.deleteRole(roleId);
      this.logger.log(`Role deleted successfully: ${roleId}`);
      return `Role deleted successfully: ${roleId}`;
    } catch (error) {
      this.logger.error(`Error deleting role ${roleId}: ${error.message}`, error.stack);
      throw new HttpException("Failed to delete role", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  }
  