import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'refresh_tokens' })
export default class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @Column({ name: 'valid_until', type: 'datetime' })
  validUntil: Date;

  @CreateDateColumn({ name: 'created_datetime', type: 'datetime' })
  createdDatetime: Date;
}
