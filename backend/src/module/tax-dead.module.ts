import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenPhoneEventService } from '../service/open-phone-event.service';
import { TaxDeadController } from '../controller/tax-dead.controller';
import { TaxDeadEntity } from '../entities/tax_deed.entity';
import { TaxDeadService } from 'src/service/tax-dead.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaxDeadEntity])],
  controllers: [TaxDeadController],
  providers: [TaxDeadService],
})
export class TaxDeadModule {}
