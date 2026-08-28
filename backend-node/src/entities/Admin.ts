import {
  Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany,
  JoinColumn, CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { User } from './User';
import { Announcement } from './Announcement';

@Entity('Admins')
export class Admin {
  @PrimaryGeneratedColumn({ name: 'AdminId' })
  adminId!: number;

  @Column({ name: 'UserId', type: 'int' })
  userId!: number;

  @Column({ name: 'EmployeeId', type: 'varchar', length: 50, unique: true })
  employeeId!: string;

  @Column({ name: 'Department', type: 'varchar', length: 100, nullable: true })
  department!: string | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @OneToOne(() => User, (u) => u.admin)
  @JoinColumn({ name: 'UserId' })
  user!: User;

  @OneToMany(() => Announcement, (a) => a.admin)
  announcements!: Announcement[];
}
