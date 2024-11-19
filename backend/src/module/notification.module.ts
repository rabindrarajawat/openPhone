import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationService } from '../service/notification.service';
import { NotificationGateway } from '../gateways/notification.gateway';
import { OpenPhoneEventEntity } from 'src/entities/open-phone-event.entity';
import { OpenPhoneEventService } from 'src/service/open-phone-event.service';
import { NotificationController } from 'src/controller/notification.controller';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CustomLogger } from 'src/service/logger.service';
import { AddressEntity } from 'src/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity,OpenPhoneEventEntity,AddressEntity])],
  providers: [NotificationService,CustomLogger, NotificationGateway,JwtService,ConfigService],
  controllers: [NotificationController],
})
export class NotificationModule {}