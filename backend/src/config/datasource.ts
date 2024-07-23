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
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: String(process.env.DB_HOST),
  port: parseInt(String(process.env.DB_PORT), 10),
  username: String(process.env.DB_USERNAME),
  password: String(process.env.DB_PASSWORD),  // Explicitly convert to string
  database: String(process.env.DB_DATABASE),
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


