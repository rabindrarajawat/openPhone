import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { CommonEntity } from "./common-columns.entity";

@Entity("open_phone_event")
<<<<<<< HEAD
export class OpenPhoneEventEntity extends CommonEntity {
  // export class OpenPhoneEvent {
=======
export class OpenPhoneEvent extends CommonEntity {
// export class OpenPhoneEvent {
>>>>>>> parent of 6863df3 (Merge pull request #1 from rabindrarajawat/dev_ram)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event_type_id: number;

  @Column()
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
  conversation_id: number;

  // @CreateDateColumn()
  // created_at: Date;

  @CreateDateColumn()
  received_at: Date;

  @Column()
  contact_established: string;

  @Column()
  dead: string;

  @Column()
  keep_an_eye: string;

  @Column()
  stop: string;
}
