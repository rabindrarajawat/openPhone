import { Entity,PrimaryGeneratedColumn,Column, CreateDateColumn } from "typeorm";
import { CommonEntity } from "./common-columns.entity";

@Entity('address')
   export class AddressEntity extends CommonEntity {

    @PrimaryGeneratedColumn()
    id:number ;

    @Column()
    address:string

    @CreateDateColumn()
  date: Date;

}