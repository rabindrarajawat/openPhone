 import { DataSource } from "typeorm"
import {  OpenPhoneEvent } from "../entities/open-phone-event.entity"
import { OpenPhoneEventType } from "../entities/open-phone-event-type.entity"
import { OpenPhoneEventDirection } from "../entities/open-phone-event-direction.entity"
import { Address } from "../entities/address.entity"
import { AuctionEvent } from "../entities/auction-event.entity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "openphone",
    entities: [OpenPhoneEvent,OpenPhoneEventType,OpenPhoneEventDirection,Address,AuctionEvent],
    migrations: ["src/migrations/**/*.ts"],
    synchronize: false,
})