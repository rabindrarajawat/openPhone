import 'dotenv/config';
import { DataSource } from 'typeorm';
import { OpenPhoneEvent } from '../entities/open-phone-event.entity';
import { OpenPhoneEventType } from '../entities/open-phone-event-type.entity';
import { OpenPhoneEventDirection } from '../entities/open-phone-event-direction.entity';
import { Address } from '../entities/address.entity';
import { AuctionEvent } from '../entities/auction-event.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        OpenPhoneEvent,
        OpenPhoneEventType,
        OpenPhoneEventDirection,
        Address,
        AuctionEvent
    ],
    migrations: ['src/migrations/**/*.ts'],
    synchronize: process.env.DB_SYNC === 'true',
});
