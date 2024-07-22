<<<<<<< HEAD
import { DataSource } from "typeorm"
import { OpenPhoneEventEntity } from "../entities/open-phone-event.entity"
import { OpenPhoneEventTypeEntity } from "../entities/open-phone-event-type.entity"
import { OpenPhoneEventDirectionEntity } from "../entities/open-phone-event-direction.entity"
import { AddressEntity } from "../entities/address.entity"
import { AuctionEventEntity } from "../entities/auction-event.entity"
import { CaseEventEntity } from "../entities/case-event.entity"
import { MessageMasterEntity } from "../entities/message-template.entity"
import { AddressMappingEntity } from "../entities/address-mapping.entity"
=======
 import { DataSource } from "typeorm"
import {  OpenPhoneEvent } from "../entities/open-phone-event.entity"
import { OpenPhoneEventType } from "../entities/open-phone-event-type.entity"
import { OpenPhoneEventDirection } from "../entities/open-phone-event-direction.entity"
import { Address } from "../entities/address.entity"
import { AuctionEvent } from "../entities/auction-event.entity"
>>>>>>> parent of 6863df3 (Merge pull request #1 from rabindrarajawat/dev_ram)

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "openphone",
<<<<<<< HEAD
    entities: [OpenPhoneEventEntity, OpenPhoneEventTypeEntity, OpenPhoneEventDirectionEntity, AddressEntity, AuctionEventEntity, MessageMasterEntity, CaseEventEntity, AddressMappingEntity],
=======
    entities: [OpenPhoneEvent,OpenPhoneEventType,OpenPhoneEventDirection,Address,AuctionEvent],
>>>>>>> parent of 6863df3 (Merge pull request #1 from rabindrarajawat/dev_ram)
    migrations: ["src/migrations/**/*.ts"],
    synchronize: false,
})