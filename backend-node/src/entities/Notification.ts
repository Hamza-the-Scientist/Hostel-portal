import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('Notifications')
export class Notification {
  @PrimaryGeneratedColumn({ name: 'NotificationId' })
  notificationId!: number;

  @Column({ name: 'UserId', type: 'int' })
  userId!: number;

  @Column({ name: 'Title', type: 'varchar', length: 200 })
  title!: string;

  @Column({ name: 'Message', type: 'varchar', length: 2000 })
  message!: string;

  @Column({ name: 'IsRead', type: 'boolean', default: false })
  isRead!: boolean;

  @Column({ name: 'Link', type: 'varchar', length: 500, nullable: true })
  link!: string | null;

  @Column({ name: 'SentAt', type: 'datetime' })
  sentAt!: Date;

  @Column({ name: 'ReadAt', type: 'datetime', nullable: true })
  readAt!: Date | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @ManyToOne(() => User, (u) => u.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserId' })
  user!: User;
}
