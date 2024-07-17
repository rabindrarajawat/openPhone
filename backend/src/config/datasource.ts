 import { DataSource } from "typeorm"
import {  OpenPhoneEventEntity } from "../entities/open-phone-event.entity"
import { OpenPhoneEventTypeEntity } from "../entities/open-phone-event-type.entity"
import { OpenPhoneEventDirectionEntity } from "../entities/open-phone-event-direction.entity"
import { AddressEntity } from "../entities/address.entity"
import { AuctionEvent } from "../entities/auction-event.entity"
import { CaseEventEntity } from "../entities/case-event.entity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "openphone",
    entities: [OpenPhoneEventEntity,OpenPhoneEventTypeEntity,OpenPhoneEventDirectionEntity,AddressEntity,AuctionEvent,CaseEventEntity],
    migrations: ["src/migrations/**/*.ts"],
    synchronize: true,
})