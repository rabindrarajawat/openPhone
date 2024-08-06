// notification.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { OpenPhoneEventEntity } from "./open-phone-event.entity";

@Entity("notifications")
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:true})
  address_id: number;

  @Column()
  event_id: number;

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => OpenPhoneEventEntity, event => event.notifications)
@JoinColumn({ name: 'event_id' })
event: OpenPhoneEventEntity;
}


