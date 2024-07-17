import { Entity,PrimaryGeneratedColumn,Column } from "typeorm";

@Entity('open_phone_event_direction')
export class OpenPhoneEventDirection{

    @PrimaryGeneratedColumn()
    id:number ;

    @Column()
    name:string

}