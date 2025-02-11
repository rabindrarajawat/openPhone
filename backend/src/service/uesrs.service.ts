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
  private readonly jwtSecret = process.env.JWT_SECRET_PRIVATE; 
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

  async getAllUsers(): Promise<Partial<UserEntity>[]> {
     const userData= await this.usersRepository.find({ relations: ['role'] }
      
     );
   const data=  userData.map((user)=>{
      const {password,...rest}= user;
      return rest;
     })
     return data;
  }

  async editUser(id: string, updateUserDto: CreateUsersDto): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'], // Include role relation to access role info
    });
  
    if (!user) {
      throw new HttpException(`User with ID ${id} not found.`, HttpStatus.NOT_FOUND);
    }
  
    // Fetch roleId based on roleName
    const role = await this.roleRepository.findOne({
      where: { name: updateUserDto.roleName },
    });
  
    if (!role) {
      throw new HttpException(`Role with name ${updateUserDto.roleName} not found.`, HttpStatus.NOT_FOUND);
    }
  
    // Create an update object excluding undefined values
    const updateData: Partial<CreateUsersDto> = {
      name: updateUserDto.name,
      email: updateUserDto.email,
      roleName: role.name, // Use the fetched roleId
    };
  
    // Only update password if it's provided
    if (updateUserDto.password) {
      updateData['password'] = await bcrypt.hash(updateUserDto.password, 10);
    }
  
    // Update user details
    Object.assign(user, updateData);
  
    try {
      const savedUser = await this.usersRepository.save(user);
      return savedUser;
    } catch (error) {
      throw new HttpException(
        `Failed to update user: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
  


  // Delete User
  async deleteUser(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(`User with ID ${id} not found.`, HttpStatus.NOT_FOUND);
    }

    await this.usersRepository.remove(user);
  }

  async createUser(createUserDto: CreateUsersDto): Promise<{
    id: string;
    name: string;
    email: string;
    password: string;
    roleName: string;
  }> {
    try {
      const { roleName, password, ...rest } = createUserDto;

      // Debugging: Log the received DTO
      console.log('Received DTO:', createUserDto);

      // Check if password is provided
      if (!password) {
        throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
      }

      // Find role by role name
      const role = await this.roleRepository.findOne({ where: { name: roleName } });

      // Debugging: Log the role result
      console.log('Found role:', role);

      // If role not found, throw error
      if (!role) {
        throw new HttpException(`Role with name '${roleName}' not found.`, HttpStatus.NOT_FOUND);
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); 

      // Create the user entity and assign the role
      const newUser = this.usersRepository.create({
        ...rest,
        password: hashedPassword,
        role, // Assign the role entity
      });

      // Save the new user to the database
      await this.usersRepository.save(newUser);

      // Return the user data with role name
      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        roleName: role.name, // Return role name
      };
    } catch (error) {
      // Log the error to debug
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
      { expiresIn: '8h' } // Token expiration time
    );

    return { token };
  }
}


