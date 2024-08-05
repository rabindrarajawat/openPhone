import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { CommonEntity } from "./common-columns.entity";
import { OpenPhoneEventEntity } from "./open-phone-event.entity";

// address.entity.ts

@Entity("address")
export class AddressEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @CreateDateColumn({ nullable: true })
  date: Date;
  @OneToMany(() => OpenPhoneEventEntity, (event) => event.address)
  events: OpenPhoneEventEntity[];
}
