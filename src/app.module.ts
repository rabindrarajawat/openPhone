// // import { Module } from '@nestjs/common';
// // import { TypeOrmModule } from '@nestjs/typeorm';
// // import * as dotenv from 'dotenv';

// // dotenv.config(); // Load environment variables from .env file

// // @Module({
// //   imports: [
// //     TypeOrmModule.forRoot({
//       // type: 'postgres',
//       // host: process.env.DB_HOST,
//       // port: parseInt(process.env.DB_PORT, 10),
//       // username: process.env.DB_USERNAME,
//       // password: process.env.DB_PASSWORD,
//       // database: process.env.DB_DATABASE,
//       // entities: [__dirname + '/**/*.entity{.ts,.js}'],
// //       synchronize: true, // Set to false in production, use migrations instead
// //     }),
// //   ],
// // })
// // export class AppModule {}





// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { OpenPhoneEvent } from './entities/open-phone-event.entity';
// import { OpenPhoneEventType } from './entities/open-phone-event-type.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DB_HOST,
//       port: parseInt(process.env.DB_PORT, 10),
//       username: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_DATABASE,
//       entities: [OpenPhoneEvent,OpenPhoneEventType],
//        synchronize: false,
//       migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
//       migrationsRun: false,
//     }),
//   ],
// })
// export class AppModule {}




import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenPhoneEvent } from './entities/open-phone-event.entity';
import { OpenPhoneEventType } from './entities/open-phone-event-type.entity';
 import { AuctionEvent } from './entities/auction-event.entity';
import { OpenPhoneEventModule } from './module/open-phone-event.module';

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
        entities: [OpenPhoneEvent, OpenPhoneEventType,AuctionEvent],
        synchronize: false,
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsRun: false,
      }),
      inject: [ConfigService],
    }),
    OpenPhoneEventModule
  ],
})
export class AppModule {}