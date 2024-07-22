// import { Entity,PrimaryGeneratedColumn,Column } from "typeorm";

// @Entity('tax_deed')
// export class AuctionEvent{

//     @PrimaryGeneratedColumn()
//     id:number ;

//     @Column()
//     event_id:number

// }



<<<<<<< HEAD
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { CommonEntity } from "./common-columns.entity"; 
@Entity('tax_dead')
export class TaxDeadEntity extends CommonEntity {
    @PrimaryGeneratedColumn()
    id: number;
=======
// import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
// import { CommonEntity } from "./common-columns.entity"; 
// @Entity('tax_deed')
// export class AuctionEvent extends CommonEntity {
//     @PrimaryGeneratedColumn()
//     id: number;
>>>>>>> parent of 6863df3 (Merge pull request #1 from rabindrarajawat/dev_ram)

//     @Column()
//     event_id: number;
// }