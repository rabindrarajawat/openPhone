import { CreateDateColumn, UpdateDateColumn, Column, BaseEntity } from "typeorm";

export abstract class CommonEntity extends BaseEntity {
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn({ nullable: true })
    modified_at: Date;
    
    @Column({ nullable: true })
    created_by: string;

    @Column({ nullable: true })
    modified_by: string;

    @Column({ default: true })
    is_active: boolean;
}