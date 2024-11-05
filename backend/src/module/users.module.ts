import { UserEntity } from '../entities/users.entity';
import { UsersController } from '../controller/users.controller';
import { UsersService } from '../service/uesrs.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../entities/role.entity';
import { CustomLogger } from 'src/service/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  controllers: [UsersController],
  providers: [UsersService,CustomLogger],
})
export class usersModule {}
