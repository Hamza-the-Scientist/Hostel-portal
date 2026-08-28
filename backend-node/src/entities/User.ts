import {
  Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { Student } from './Student';
import { Admin } from './Admin';
import { Notification } from './Notification';
import { AuditLog } from './AuditLog';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn({ name: 'UserId' })
  userId!: number;

  @Column({ name: 'Email', type: 'varchar', length: 256, unique: true })
  email!: string;

  @Column({ name: 'PasswordHash', type: 'varchar', length: 512 })
  passwordHash!: string;

  @Column({ name: 'FirstName', type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ name: 'LastName', type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ name: 'Role', type: 'varchar', length: 20 })
  role!: string;

  @Column({ name: 'IsActive', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'PhoneNumber', type: 'varchar', length: 20, nullable: true })
  phoneNumber!: string | null;

  @Column({ name: 'LastLoginAt', type: 'datetime', nullable: true })
  lastLoginAt!: Date | null;

  @Column({ name: 'IsDeleted', type: 'boolean', default: false })
  isDeleted!: boolean;

  @Column({ name: 'DeletedAt', type: 'datetime', nullable: true })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @OneToOne(() => Student, (s) => s.user)
  student!: Student;

  @OneToOne(() => Admin, (a) => a.user)
  admin!: Admin;

  @OneToMany(() => Notification, (n) => n.user)
  notifications!: Notification[];

  @OneToMany(() => AuditLog, (a) => a.performedBy)
  auditLogs!: AuditLog[];
}
