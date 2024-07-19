import { UserEntity } from '../entities/users.entity';
import { UsersController } from '../controller/users.controller';
import { UsersService } from '../service/users.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class usersModule {}
