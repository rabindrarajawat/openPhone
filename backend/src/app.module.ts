




import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenPhoneEvent } from './entities/open-phone-event.entity';
import { OpenPhoneEventType } from './entities/open-phone-event-type.entity';
 import { AuctionEvent } from './entities/auction-event.entity';
import { OpenPhoneEventModule } from './module/open-phone-event.module';
import { usersModule } from './module/users.module';
import { RoleModule } from './module/role.module';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/users.entity';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [OpenPhoneEvent, OpenPhoneEventType,AuctionEvent,RoleEntity,UserEntity],
        synchronize: false,
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsRun: false,
      }),
      inject: [ConfigService],
    }),
    OpenPhoneEventModule,
    usersModule,
    RoleModule
    
  ],
})
export class AppModule {}