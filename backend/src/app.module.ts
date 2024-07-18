import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { OpenPhoneEventEntity } from "./entities/open-phone-event.entity";
import { OpenPhoneEventTypeEntity } from "./entities/open-phone-event-type.entity";
import { AuctionEventEntity } from "./entities/auction-event.entity";
import { OpenPhoneEventModule } from "./module/open-phone-event.module";
import { AdressModule } from "./module/address.module";
import { OpenPhoneEventDirectionModule } from "./module/open-phone-event-direction.module";
import { OpenPhoneEventTypeModule } from "./module/open-phone-event-type.module";
import { AddressEntity } from "./entities/address.entity";
import { OpenPhoneEventDirectionEntity } from "./entities/open-phone-event-direction.entity";
import { CaseEventModule } from "./module/case-event.module";
import { CaseEventEntity } from "./entities/case-event.entity";
import { AuctionEventModule } from "./module/auction-event.module";
import { TaxDeadModule } from "./module/tax-dead.module";
import { TaxDeadEntity } from "./entities/tax_deed.entity";
import { MessageMasterEntity } from "./entities/message-template.entity";
import { MessageMasterModule } from "./module/message-master.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_DATABASE"),
        entities: [
          OpenPhoneEventEntity,
          AddressEntity,
          OpenPhoneEventTypeEntity,
          AuctionEventEntity,
          OpenPhoneEventDirectionEntity,
          CaseEventEntity,
          TaxDeadEntity,
          MessageMasterEntity,MessageMasterEntity
        ],
        synchronize: true,
        migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
        migrationsRun: true,
      }),
      inject: [ConfigService],
    }),
    OpenPhoneEventModule,
    AdressModule,
    OpenPhoneEventDirectionModule,
    OpenPhoneEventTypeModule,
    CaseEventModule,
    AuctionEventModule,TaxDeadModule,MessageMasterModule
  ],
})
export class AppModule {}
