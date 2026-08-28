import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Application } from './Application';
import { Student } from './Student';
import { Bed } from './Bed';
import { Resident } from './Resident';

@Entity('Allocations')
export class Allocation {
  @PrimaryGeneratedColumn({ name: 'AllocationId' })
  allocationId!: number;

  @Column({ name: 'ApplicationId', type: 'int' })
  applicationId!: number;

  @Column({ name: 'StudentId', type: 'int' })
  studentId!: number;

  @Column({ name: 'BedId', type: 'int' })
  bedId!: number;

  @Column({ name: 'AllocatedAt', type: 'datetime' })
  allocatedAt!: Date;

  @Column({ name: 'IsActive', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'IsDeleted', type: 'boolean', default: false })
  isDeleted!: boolean;

  @Column({ name: 'DeletedAt', type: 'datetime', nullable: true })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @ManyToOne(() => Application, (a) => a.allocations)
  @JoinColumn({ name: 'ApplicationId' })
  application!: Application;

  @ManyToOne(() => Student, (s) => s.allocations)
  @JoinColumn({ name: 'StudentId' })
  student!: Student;

  @ManyToOne(() => Bed, (b) => b.allocations)
  @JoinColumn({ name: 'BedId' })
  bed!: Bed;

  @OneToOne(() => Resident, (r) => r.allocation)
  resident!: Resident;
}
