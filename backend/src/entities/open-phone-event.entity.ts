import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { CommonEntity } from "./common-columns.entity";
import { NotificationEntity } from "./notification.entity";
import { BookmarkEntity } from "./bookmark.entity";
import { AddressEntity } from "./address.entity";

@Entity("open_phone_event")
// export class OpenPhoneEventEntity extends CommonEntity {
export class OpenPhoneEventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event_type_id: number;

  @Column({ nullable: true })
  address_id: number;

  @Column()
  event_direction_id: number;

  @Column({ nullable: true })
  auction_event_id: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column("text", { nullable: true })
  body: string | null;

  @Column()
  url: string;

  @Column()
  url_type: string;

  @Column()
  conversation_id: string;

  @Column({ nullable: true })
  created_by: string;

  @Column()
  contact_established: string;

  @Column()
  dead: string;

  @Column({ nullable: true })
  created_at: string;

  @Column({ nullable: true })
  received_at: string;

  @Column()
  keep_an_eye: string;

  @Column({ type: "boolean", default: false })
  is_stop: boolean;

  @Column({ nullable: true })
  phone_number_id: string;

  @Column({ nullable: true })
  user_id: string;

  @Column({ type: "boolean", default: false })
  is_message_pinned: boolean;

  @Column({ type: "boolean", default: false })
  is_number_pinned: boolean;


  @ManyToOne(() => AddressEntity, address => address.events)
  address: AddressEntity;

  @OneToMany(() => NotificationEntity, notification => notification.event)
  notifications: NotificationEntity[];
}
