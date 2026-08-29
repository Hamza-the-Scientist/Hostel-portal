import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('AdminSettings')
export class AdminSettings {
  @PrimaryGeneratedColumn({ name: 'SettingsId' })
  settingsId!: number;

  @Column({ name: 'AllocationOpen', type: 'boolean', default: true })
  allocationOpen!: boolean;

  @Column({ name: 'AllocationDeadline', type: 'datetime', nullable: true })
  allocationDeadline!: Date | null;

  @Column({ name: 'MaxAllocationPerCycle', type: 'int', default: 100 })
  maxAllocationPerCycle!: number;

  @Column({ name: 'AllocationEnabled', type: 'boolean', default: true })
  allocationEnabled!: boolean;

  @Column({ name: 'SindhProvinceFee', type: 'decimal', precision: 10, scale: 2, default: 25000 })
  sindhProvinceFee!: number;

  @Column({ name: 'OtherProvincesFee', type: 'decimal', precision: 10, scale: 2, default: 35000 })
  otherProvincesFee!: number;

  @Column({ name: 'InternationalStudentsFee', type: 'decimal', precision: 10, scale: 2, default: 75000 })
  internationalStudentsFee!: number;

  @Column({ name: 'ProcessingFee', type: 'decimal', precision: 10, scale: 2, default: 100 })
  processingFee!: number;

  @Column({ name: 'AcademicYear', type: 'varchar', length: 50, default: '2025-2026' })
  academicYear!: string;

  @Column({ name: 'EffectiveFrom', type: 'datetime', nullable: true })
  effectiveFrom!: Date;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;
}
