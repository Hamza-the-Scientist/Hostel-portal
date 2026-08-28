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

  @Column({ name: 'EffectiveFrom', type: 'datetime' })
  effectiveFrom!: Date;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;
}
