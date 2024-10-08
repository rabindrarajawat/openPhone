import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { CommonEntity } from "./common-columns.entity";
@Entity("auction_event")
export class AuctionEventEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event_id: number;
}
