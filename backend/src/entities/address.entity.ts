import { Entity,PrimaryGeneratedColumn,Column, CreateDateColumn } from "typeorm";

@Entity('address')
export class Address{

    @PrimaryGeneratedColumn()
    id:number ;

    @Column()
    address:string

    @CreateDateColumn()
  date: Date;

}