import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenPhoneEventService } from '../service/open-phone-event.service';
import { OpenPhoneEventController } from '../controller/open-phone-event.controller';
import { OpenPhoneEventEntity } from '../entities/open-phone-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OpenPhoneEventEntity])],
  controllers: [OpenPhoneEventController],
  providers: [OpenPhoneEventService],
})
export class OpenPhoneEventModule {}
