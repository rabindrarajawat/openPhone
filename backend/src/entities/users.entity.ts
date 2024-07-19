import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => RoleEntity, role => role.users)
  @JoinColumn({ name: 'roleid' })
  role: RoleEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modified_at: Date;

  @Column({ nullable: true })
  created_by: string;

  @Column({ nullable: true })
  modified_by: string;

  @Column({ default: true })
  is_active: boolean;
}
