import { DataSource } from 'typeorm';
import { OpenPhoneEventEntity } from '../entities/open-phone-event.entity';
import { OpenPhoneEventTypeEntity } from '../entities/open-phone-event-type.entity';
import { OpenPhoneEventDirectionEntity } from '../entities/open-phone-event-direction.entity';
import { AddressEntity } from '../entities/address.entity';
import { AuctionEventEntity } from '../entities/auction-event.entity';
import { RoleEntity } from '../entities/role.entity';
import { UserEntity } from '../entities/users.entity';
import { CaseEventEntity } from "../entities/case-event.entity"
import { MessageMasterEntity } from "../entities/message-template.entity"
import { AddressMappingEntity } from "../entities/address-mapping.entity"

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
