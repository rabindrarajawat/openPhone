import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/users.entity';
import { RoleEntity } from '../entities/role.entity';
import { CreateUsersDto } from '../dto/users.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  private readonly jwtSecret = 'SBEQUSATXXXDXEZ3BC56RG6O2SZC7UMMY5YGZ4W5GQZPFHPPHUHKB2UC'; 
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['role'] });
    if (!user) {
      throw new HttpException(`User with ID ${id} not found.`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.usersRepository.find({ relations: ['role'] });
  }
  async createUser(createUserDto: CreateUsersDto): Promise<{
    id: string;
    name: string;
    email: string;
    password: string;
    roleName: string;
  }> {
    try {
      console.log('Received DTO:', createUserDto); // Debugging line
  
      const { roleid, password, ...rest } = createUserDto;
      
      console.log('Extracted password:', password); // Debugging line
  
      if (!password) {
        throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
      }
  
      const role = await this.roleRepository.findOne({ where: { id: roleid } });
  
      if (!role) {
        throw new HttpException(`Role with ID ${roleid} not found.`, HttpStatus.NOT_FOUND);
      }
  
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt
  
      console.log('Hashed password:', hashedPassword); // Debugging line
  
      const newUser = this.usersRepository.create({
        ...rest,
        password: hashedPassword,
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
      console.error('Error during user creation:', error.message); // Debugging line
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  
  
  
  

  async validateUserByEmail(email: string, password: string): Promise<{ token: string }> {
    const user = await this.usersRepository.findOne({ where: { email }, relations: ['role'] });

    if (!user) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    if (!user.password) {
      throw new HttpException('Password not found', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role.name,name:user.name }, // Ensure role has a name property
      this.jwtSecret,
      { expiresIn: '1h' } // Token expiration time
    );

    return { token };
  }
}


