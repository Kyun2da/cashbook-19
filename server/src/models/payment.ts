import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'payments' })
export default class Payment extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: string;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: string;

  @Column({ name: 'name', type: 'varchar', length: 30 })
  name: string;

  @CreateDateColumn({ name: 'created_datetime', type: 'datetime' })
  createdDatetime: Date;

  @UpdateDateColumn({ name: 'updated_datetime', type: 'datetime' })
  updatedDatetime: Date;
}
