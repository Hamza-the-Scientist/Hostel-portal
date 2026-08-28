import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';
import { Department } from './Department';
import { Program } from './Program';

@Entity('UniversityStudentRecords')
export class UniversityStudentRecord {
  @PrimaryGeneratedColumn({ name: 'RecordId' })
  recordId!: number;

  @Column({ name: 'StudentId', type: 'int' })
  studentId!: number;

  @Column({ name: 'DepartmentId', type: 'int', nullable: true })
  departmentId!: number | null;

  @Column({ name: 'ProgramId', type: 'int', nullable: true })
  programId!: number | null;

  @Column({ name: 'Semester', type: 'int', default: 1 })
  semester!: number;

  @Column({ name: 'Cgpa', type: 'decimal', precision: 4, scale: 2, default: 0.0 })
  cgpa!: number;

  @Column({ name: 'IsVerified', type: 'boolean', default: true })
  isVerified!: boolean;

  @Column({ name: 'VerifiedAt', type: 'datetime', nullable: true })
  verifiedAt!: Date | null;

  @Column({ name: 'VerifiedBy', type: 'varchar', length: 100, nullable: true })
  verifiedBy!: string | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @OneToOne(() => Student, (s) => s.universityRecord)
  @JoinColumn({ name: 'StudentId' })
  student!: Student;

  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'DepartmentId' })
  department!: Department | null;

  @ManyToOne(() => Program, { nullable: true })
  @JoinColumn({ name: 'ProgramId' })
  program!: Program | null;
}
