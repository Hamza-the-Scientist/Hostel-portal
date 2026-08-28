import {
  Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { User } from './User';
import { StudentProfile } from './StudentProfile';
import { UniversityStudentRecord } from './UniversityStudentRecord';
import { District } from './District';
import { Application } from './Application';
import { Allocation } from './Allocation';

@Entity('Students')
export class Student {
  @PrimaryGeneratedColumn({ name: 'StudentId' })
  studentId!: number;

  @Column({ name: 'UserId', type: 'int' })
  userId!: number;

  @Column({ name: 'RegistrationNumber', type: 'varchar', length: 50, unique: true })
  registrationNumber!: string;

  @Column({ name: 'Cnic', type: 'varchar', length: 13, unique: true })
  cnic!: string;

  @Column({ name: 'Gender', type: 'varchar', length: 10 })
  gender!: string;

  @Column({ name: 'DateOfBirth', type: 'date' })
  dateOfBirth!: string;

  @Column({ name: 'DistrictId', type: 'int', nullable: true })
  districtId!: number | null;

  @Column({ name: 'IsDeleted', type: 'boolean', default: false })
  isDeleted!: boolean;

  @Column({ name: 'DeletedAt', type: 'datetime', nullable: true })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @OneToOne(() => User, (u) => u.student)
  @JoinColumn({ name: 'UserId' })
  user!: User;

  @ManyToOne(() => District, (d) => d.students, { nullable: true })
  @JoinColumn({ name: 'DistrictId' })
  district!: District | null;

  @OneToOne(() => StudentProfile, (p) => p.student, { cascade: true })
  profile!: StudentProfile;

  @OneToOne(() => UniversityStudentRecord, (r) => r.student, { cascade: true })
  universityRecord!: UniversityStudentRecord;

  @OneToMany(() => Application, (a) => a.student)
  applications!: Application[];

  @OneToMany(() => Allocation, (a) => a.student)
  allocations!: Allocation[];
}
