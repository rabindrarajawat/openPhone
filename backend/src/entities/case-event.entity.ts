import { Entity,PrimaryGeneratedColumn,Column } from "typeorm";

@Entity('case_event')
export class CaseEvent{

    @PrimaryGeneratedColumn()
    id:number ;

    @Column()
    event_id:number

}