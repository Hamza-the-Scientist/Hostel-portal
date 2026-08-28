import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('AcademicYears')
export class AcademicYear {
  @PrimaryGeneratedColumn({ name: 'AcademicYearId' })
  academicYearId!: number;

  @Column({ name: 'Label', type: 'varchar', length: 20, unique: true })
  label!: string;

  @Column({ name: 'StartDate', type: 'date' })
  startDate!: string;

  @Column({ name: 'EndDate', type: 'date' })
  endDate!: string;

  @Column({ name: 'IsActive', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;
}
