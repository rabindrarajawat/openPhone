import { Entity,PrimaryGeneratedColumn,Column } from "typeorm";

@Entity('open_phone_event_type')
export class OpenPhoneEventType{

    @PrimaryGeneratedColumn()
    id:number ;

    @Column()
    name:string

}