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
      private roleRepository: Repository<RoleEntity>
    ) {}
  
    async createRole(data: RoleDto): Promise<string> {
      try {
        console.log('Creating role with data:', data);
    
        // Check if a role with the same name already exists
        const existingRole = await this.roleRepository.findOne({
          where: { name: data.name },
        });
    
        if (existingRole) {
          throw new HttpException(
            `Role with name '${data.name}' already exists.`,
            HttpStatus.CONFLICT,
          );
        }
    
        console.log('Role does not exist, creating new role...');
    
        // Create a new role using the provided roleName
        const role = new RoleEntity();
        role.name = data.name;
    
        const addedRole = await this.roleRepository.save(role);
        console.log('Role created with ID:', addedRole.id);
    
        return addedRole.id;
      } catch (error) {
        console.error('Error creating role:', error.message);
        throw new HttpException('Failed to create role', HttpStatus.INTERNAL_SERVER_ERROR);
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