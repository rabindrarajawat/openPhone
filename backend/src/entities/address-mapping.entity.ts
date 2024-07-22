import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
  } from "typeorm";
  import { CommonEntity } from "./common-columns.entity";
  
  @Entity("address_mapping")
  export class AddressMappingEntity extends CommonEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    address_id: number;
  
  
    @Column()
    conversation_id: number;
  
     
  }
  