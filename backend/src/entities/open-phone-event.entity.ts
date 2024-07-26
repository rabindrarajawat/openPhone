import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { CommonEntity } from "./common-columns.entity";

@Entity("open_phone_event")
export class OpenPhoneEventEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event_type_id: number;

  @Column({ nullable: true })
  address_id: number;

  @Column()
  event_direction_id: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column("text")
  body: string;

  @Column()
  url: string;

  @Column()
  url_type: string;

  @Column()
  conversation_id: string;



  @CreateDateColumn()
  received_at: Date;

  @Column()
  contact_established: string;

  @Column()
  dead: string;

  @Column()
  keep_an_eye: string;

  @Column({ type: "boolean", default: false })
  is_stop: boolean;

  @Column({ nullable: true })
  phone_number_id: string;

  @Column({ nullable: true })
  user_id: string;

}
