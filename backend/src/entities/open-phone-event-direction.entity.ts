import { Entity,PrimaryGeneratedColumn,Column } from "typeorm";
import { CommonEntity } from "./common-columns.entity";

@Entity('open_phone_event_direction')
     export class OpenPhoneEventDirectionEntity extends CommonEntity {

    @PrimaryGeneratedColumn()
    id:number ;

    @Column()
    name:string

}