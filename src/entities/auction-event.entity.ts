import { Entity,PrimaryGeneratedColumn,Column } from "typeorm";

@Entity('auction_event')
export class AuctionEvent{

    @PrimaryGeneratedColumn()
    id:number ;

    @Column()
    event_id:number

}