import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/users.entity';
import { RoleEntity } from '../entities/role.entity'; // Ensure RoleEntity is imported correctly
import { CreateUsersDto } from '../dto/users.dto';

@Injectable()
export class UsersService {
  getUserById(id: string): UserEntity | PromiseLike<UserEntity> {
    throw new Error('Method not implemented.');
  }
  getAllUsers(): UserEntity[] | PromiseLike<UserEntity[]> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async createUser(createUserDto: CreateUsersDto): Promise<{
    id: string;
    name: string;
    email: string;
    password: string;
    roleName: string;
  }> {
    try {
      const { roleid, ...rest } = createUserDto;
      const role = await this.roleRepository.findOne({ where: { id: roleid } });

      if (!role) {
        throw new HttpException(`Role with ID ${roleid} not found.`, HttpStatus.NOT_FOUND);
      }

      const newUser = this.usersRepository.create({
        ...rest,
        role,
      });
      await this.usersRepository.save(newUser);

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password, 
        roleName: role.name,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
