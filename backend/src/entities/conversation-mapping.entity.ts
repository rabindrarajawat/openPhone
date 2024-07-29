import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('conversation_mapping')
export class conversationmapping {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    conversation_id: string; // Ensure this matches the name used in the service

    @Column()
    address_id: number; // Ensure this matches the name used in the service

    // other columns...
}
