import { Entity, Column } from "typeorm";


import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created;

  @UpdateDateColumn()
  updated;
}

@Entity()
export class UserEntity extends BaseEntity {
  @Column({
    nullable: true,
  })
  vk_id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
    nullable: true,
  })
  email: string;

  @Column({
    select: false,
    nullable: true,
  })
  password: string;

  @Column({
    nullable: false,
  })
  grant: number;

  @Column()
  avatar_url: string;
}
