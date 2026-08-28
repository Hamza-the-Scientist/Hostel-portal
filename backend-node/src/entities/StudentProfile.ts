import {
  Entity, PrimaryGeneratedColumn, Column, OneToOne,
  JoinColumn, CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { Student } from './Student';

@Entity('StudentProfiles')
export class StudentProfile {
  @PrimaryGeneratedColumn({ name: 'ProfileId' })
  profileId!: number;

  @Column({ name: 'StudentId', type: 'int' })
  studentId!: number;

  @Column({ name: 'PhotoUrl', type: 'varchar', length: 255, nullable: true })
  photoUrl!: string | null;

  @Column({ name: 'GuardianName', type: 'varchar', length: 150, nullable: true })
  guardianName!: string | null;

  @Column({ name: 'GuardianPhone', type: 'varchar', length: 20, nullable: true })
  guardianPhone!: string | null;

  @Column({ name: 'GuardianRelation', type: 'varchar', length: 100, nullable: true })
  guardianRelation!: string | null;

  @Column({ name: 'HomeAddress', type: 'text', nullable: true })
  homeAddress!: string | null;

  @Column({ name: 'City', type: 'varchar', length: 100, nullable: true })
  city!: string | null;

  @Column({ name: 'EmergencyContact', type: 'varchar', length: 20, nullable: true })
  emergencyContact!: string | null;

  @Column({ name: 'BloodGroup', type: 'varchar', length: 5, nullable: true })
  bloodGroup!: string | null;

  @Column({ name: 'Disabilities', type: 'text', nullable: true })
  disabilities!: string | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @OneToOne(() => Student, (s) => s.profile)
  @JoinColumn({ name: 'StudentId' })
  student!: Student;
}