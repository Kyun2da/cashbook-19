import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'records' })
export default class CashRecord extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @Column({ name: 'category_id', type: 'bigint', unsigned: true })
  categoryId: number;

  @Column({ name: 'payment_id', type: 'bigint', unsigned: true })
  paymentId: number;

  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'value', type: 'int' })
  value: number;

  @Column({ name: 'date', type: 'datetime' })
  date: Date;

  @CreateDateColumn({ name: 'created_datetime', type: 'datetime' })
  createdDatetime: Date;

  @UpdateDateColumn({ name: 'updated_datetime', type: 'datetime' })
  updatedDatetime: Date;
}
