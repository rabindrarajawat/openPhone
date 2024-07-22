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
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
      OpenPhoneEventEntity,
      OpenPhoneEventTypeEntity,
      OpenPhoneEventDirectionEntity,
      AddressEntity,
      AuctionEventEntity,
      UserEntity,
      RoleEntity,
      CaseEventEntity,
      MessageMasterEntity,
      AddressMappingEntity
    ],
    migrations: ['src/migrations/**/*.ts'],
    synchronize: process.env.DB_SYNC === 'true',
  });
  

