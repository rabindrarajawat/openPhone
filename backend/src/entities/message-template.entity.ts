import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { CommonEntity } from "./common-columns.entity";

@Entity("message_master")
export class MessageMasterEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;
}   
