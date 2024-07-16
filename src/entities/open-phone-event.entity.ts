import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('open_phone_event')
export class OpenPhoneEvent {
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

  @Column('text')
  body: string;

  @Column()
  url: string;

  @Column()
  url_type: string;

  @Column()
  conversation_id: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  received_at: Date;
}