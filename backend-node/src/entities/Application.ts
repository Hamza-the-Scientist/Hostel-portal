import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';
import { AcademicYear } from './AcademicYear';
import { ApplicationHostelPreference } from './ApplicationHostelPreference';
import { Allocation } from './Allocation';

@Entity('Applications')
export class Application {
  @PrimaryGeneratedColumn({ name: 'ApplicationId' })
  applicationId!: number;

  @Column({ name: 'StudentId', type: 'int' })
  studentId!: number;

  @Column({ name: 'AcademicYearId', type: 'int' })
  academicYearId!: number;

  @Column({ name: 'Status', type: 'varchar', length: 20, default: 'Submitted' })
  status!: string;

  @Column({ name: 'SubmittedAt', type: 'datetime', nullable: true })
  submittedAt!: Date | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @ManyToOne(() => Student, (s) => s.applications)
  @JoinColumn({ name: 'StudentId' })
  student!: Student;

  @ManyToOne(() => AcademicYear)
  @JoinColumn({ name: 'AcademicYearId' })
  academicYear!: AcademicYear;

  @OneToMany(() => ApplicationHostelPreference, (p) => p.application)
  preferences!: ApplicationHostelPreference[];

  @OneToMany(() => Allocation, (a) => a.application)
  allocations!: Allocation[];
}
