import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUsersDto } from '../dto/users.dto';
import { UserEntity } from '../entities/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUsersDto): Promise<{
    id: string;
    name: string;
    email: string;
    password: string;
    roleName: string;
  }> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers(): Promise<UserEntity[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.getUserById(id);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string
  ): Promise<{ token: string }> {
    return this.usersService.validateUserByEmail(email, password);
  }
}
