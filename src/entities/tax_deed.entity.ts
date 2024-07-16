import { Entity,PrimaryGeneratedColumn,Column } from "typeorm";

@Entity('tax_deed')
export class AuctionEvent{

    @PrimaryGeneratedColumn()
    id:number ;

    @Column()
    event_id:number

}