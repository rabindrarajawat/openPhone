import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("bookmarks")
export class BookmarkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address_id: number;

  @CreateDateColumn()
  created_at: Date;
}