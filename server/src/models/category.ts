import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';

export enum PaymentType {
  Income = 'income',
  Expenditure = 'expenditure',
}

@Entity({ name: 'categories' })
export default class Category extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @Column({ name: 'type', enum: PaymentType })
  type: PaymentType;

  @Column({ name: 'name', type: 'varchar', length: 30 })
  name: string;

  @Column({ name: 'color', type: 'char', length: 6 })
  color: string;

  @CreateDateColumn({ name: 'created_datetime', type: 'datetime' })
  createdDatetime: Date;

  @UpdateDateColumn({ name: 'updated_datetime', type: 'datetime' })
  updatedDatetime: Date;
}
