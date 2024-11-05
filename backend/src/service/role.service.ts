import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
  } from "@nestjs/common";
  import { InjectRepository } from "@nestjs/typeorm";
  import { RoleEntity } from "../entities/role.entity";
  import { Repository } from "typeorm";
  import { RoleDto } from "../dto/role.dto";
  
  @Injectable()
  export class RoleService {
    constructor(
      @InjectRepository(RoleEntity)
      private roleRepository: Repository<RoleEntity>,
    ) {}
  
    async createRole(data: RoleDto): Promise<string> {
      try {
        const role = new RoleEntity();
        role.name = data.name;
  
        const addedRole = await this.roleRepository.save(role);
        return addedRole.id;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  
    // Change the return type to RoleEntity[]
    async getRoles(): Promise<RoleEntity[]> {
      try {
        return await this.roleRepository.find();
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
  
    async getRoleByID(id: string): Promise<RoleEntity> {
      return this.roleRepository.findOne({ where: { id } });
    }
  
    async deleteRole(id: string): Promise<void> {
      try {
        const role = await this.roleRepository.findOne({ where: { id } });
        if (!role) {
          throw new BadRequestException("Role not found.");
        }
        await this.roleRepository.remove(role);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }