import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenPhoneEventService } from '../service/open-phone-event.service';
import { OpenPhoneEventController } from '../controller/open-phone-event.controller';
<<<<<<< HEAD
import { OpenPhoneEventEntity } from '../entities/open-phone-event.entity';
import { AddressEntity } from 'src/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OpenPhoneEventEntity,AddressEntity])],
=======
import { OpenPhoneEvent } from '../entities/open-phone-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OpenPhoneEvent])],
>>>>>>> parent of 6863df3 (Merge pull request #1 from rabindrarajawat/dev_ram)
  controllers: [OpenPhoneEventController],
  providers: [OpenPhoneEventService],
})
export class OpenPhoneEventModule {}
