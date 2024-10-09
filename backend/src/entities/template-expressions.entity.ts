import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    
  } from "typeorm";
  import { CommonEntity } from "./common-columns.entity";
  import { OpenPhoneEventEntity } from "./open-phone-event.entity";
    
  @Entity("template_expressions")
  export class TemplatesExpressionsEntity extends CommonEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column()
    address_expression: string;
  
    @Column()
    type_expression: string;
  
    @Column()
    name_regex: string;

    @Column()
    date_regex: string;


    @Column()
    disaster_assistance_expression:string
  }
  