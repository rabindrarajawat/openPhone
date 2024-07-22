import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ length: 255, unique: true, nullable: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @ManyToOne(() => RoleEntity, role => role.users)
  @JoinColumn({ name: 'roleid' })
  role: RoleEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  modified_at: Date;

  @Column({ nullable: true })
  created_by: string;

  @Column({ nullable: true })
  modified_by: string;

  @Column({ default: true, nullable: false })
  is_active: boolean;
}
