// import { Entity,PrimaryGeneratedColumn,Column } from "typeorm";

// @Entity('tax_deed')
// export class AuctionEvent{

//     @PrimaryGeneratedColumn()
//     id:number ;

//     @Column()
//     event_id:number

// }



import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { CommonEntity } from "./common-columns.entity"; 
@Entity('tax_dead')
export class TaxDeadEntity extends CommonEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    event_id: number;
}