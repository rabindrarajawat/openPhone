import { DataSource } from 'typeorm';
import { OpenPhoneEvent } from '../entities/open-phone-event.entity';
import { OpenPhoneEventType } from '../entities/open-phone-event-type.entity';
import { OpenPhoneEventDirection } from '../entities/open-phone-event-direction.entity';
import { Address } from '../entities/address.entity';
import { AuctionEvent } from '../entities/auction-event.entity';
import { RoleEntity } from '../entities/role.entity';
import { UserEntity } from '../entities/users.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '1234',
    database: 'openphone',
    entities: [
        OpenPhoneEvent,
        OpenPhoneEventType,
        OpenPhoneEventDirection,
        Address,
        AuctionEvent,
        UserEntity,
        RoleEntity
    ],
    migrations: ['src/migrations/**/*.ts'],
    synchronize: false,
});
