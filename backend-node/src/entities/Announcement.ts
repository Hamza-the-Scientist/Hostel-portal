import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Admin } from './Admin';

@Entity('Announcements')
export class Announcement {
  @PrimaryGeneratedColumn({ name: 'AnnouncementId' })
  announcementId!: number;

  @Column({ name: 'AdminId', type: 'int' })
  adminId!: number;

  @Column({ name: 'Title', type: 'varchar', length: 300 })
  title!: string;

  @Column({ name: 'Content', type: 'text' })
  content!: string;

  @Column({ name: 'IsPublished', type: 'boolean', default: false })
  isPublished!: boolean;

  @Column({ name: 'PublishedAt', type: 'datetime', nullable: true })
  publishedAt!: Date | null;

  @Column({ name: 'ExpiresAt', type: 'datetime', nullable: true })
  expiresAt!: Date | null;

  @Column({ name: 'TargetAudience', type: 'varchar', length: 50, nullable: true })
  targetAudience!: string | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @ManyToOne(() => Admin, (a) => a.announcements)
  @JoinColumn({ name: 'AdminId' })
  admin!: Admin;
}
