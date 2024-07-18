import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { CommonEntity } from "./common-columns.entity";

@Entity("case_event")
export class CaseEventEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event_id: number;
}
