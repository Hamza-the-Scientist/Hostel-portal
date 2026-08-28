import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm';

@Entity('SimulatedUniversityRecords')
export class SimulatedUniversityRecord {
  @PrimaryGeneratedColumn({ name: 'RecordId' })
  recordId!: number;

  @Column({ name: 'FullName', type: 'varchar', length: 150 })
  fullName!: string;

  @Column({ name: 'Cnic', type: 'varchar', length: 13, unique: true })
  cnic!: string;

  @Column({ name: 'RollNumber', type: 'varchar', length: 50, unique: true })
  rollNumber!: string;

  @Column({ name: 'FatherName', type: 'varchar', length: 150 })
  fatherName!: string;

  @Column({ name: 'Address', type: 'varchar', length: 255 })
  address!: string;

  @Column({ name: 'DistrictName', type: 'varchar', length: 100 })
  districtName!: string;

  @Column({ name: 'Province', type: 'varchar', length: 50, default: 'Sindh' })
  province!: string;

  @Column({ name: 'DepartmentName', type: 'varchar', length: 150 })
  departmentName!: string;

  @Column({ name: 'ProgramName', type: 'varchar', length: 150 })
  programName!: string;

  @Column({ name: 'DegreeType', type: 'varchar', length: 20 })
  degreeType!: string;

  @Column({ name: 'Semester', type: 'int' })
  semester!: number;

  @Column({ name: 'Cgpa', type: 'decimal', precision: 4, scale: 2 })
  cgpa!: number;

  @Column({ name: 'Cpn', type: 'decimal', precision: 6, scale: 2, default: 0 })
  cpn!: number;

  @Column({ name: 'AcademicYear', type: 'varchar', length: 20, default: '2025-2026' })
  academicYear!: string;

  @Column({ name: 'Gender', type: 'varchar', length: 10 })
  gender!: string;

  @Column({ name: 'DateOfBirth', type: 'date' })
  dateOfBirth!: string;

  @Column({ name: 'ProfilePictureUrl', type: 'varchar', length: 500, nullable: true })
  profilePictureUrl!: string | null;

  @Column({ name: 'IsActive', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;
}
