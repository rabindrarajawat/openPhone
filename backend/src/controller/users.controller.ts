import { Controller, Post, Body, Get, Param,Put,Delete, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../service/uesrs.service';
import { CreateUsersDto } from '../dto/users.dto';
import { UserEntity } from '../entities/users.entity';
import { CustomLogger } from 'src/service/logger.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: CustomLogger,
  ) {}
   // Edit a user by ID
   @Put(':id')
   async editUser(
     @Param('id') id: string,
     @Body() updateUserDto: CreateUsersDto,
   ): Promise<UserEntity> {
     return this.usersService.editUser(id, updateUserDto);
   }
 
   // Delete a user by ID
   @Delete(':id')
   async deleteUser(@Param('id') id: string): Promise<void> {
     return this.usersService.deleteUser(id);
   }

  @Post()
  async createUser(@Body() createUserDto: CreateUsersDto): Promise<{
    id: string;
    name: string;
    email: string;
    password: string;
    roleName: string;
  }> {
    this.logger.log(`Create user request received with data: ${JSON.stringify(createUserDto)}`);
    
    const user = await this.usersService.createUser(createUserDto).catch(error => {
      this.logger.error('Error creating user', error);
      throw new InternalServerErrorException('Failed to create user');
    });

    this.logger.log(`User created successfully: ${JSON.stringify(user)}`);
    return user;
  }

  @Get()
  async getAllUsers(): Promise<Partial<UserEntity>[]> {
    this.logger.log('Request received to get all users');
    
    const users = await this.usersService.getAllUsers().catch(error => {
      this.logger.error('Error fetching users', error);
      throw new InternalServerErrorException('Failed to fetch users');
    });

    this.logger.log(`Fetched users successfully: ${JSON.stringify(users)}`);
    return users;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserEntity> {
    this.logger.log(`Request received to get user with id: ${id}`);
    
    const user = await this.usersService.getUserById(id).catch(error => {
      this.logger.error(`Error fetching user with id ${id}`, error);
      throw new InternalServerErrorException('Failed to fetch user');
    });

    this.logger.log(`Fetched user successfully: ${JSON.stringify(user)}`);
    return user;
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ token: string }> {
    this.logger.log(`Login request received for email: ${email}`);
    
    const result = await this.usersService.validateUserByEmail(email, password).catch(error => {
      this.logger.error(`Login failed for email: ${email}`, error);
      throw new InternalServerErrorException('Login failed');
    });

    this.logger.log(`Login successful for email: ${email}`);
    return result;
  }
}
