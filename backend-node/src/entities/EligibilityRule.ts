import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Hostel } from './Hostel';

@Entity('EligibilityRules')
export class EligibilityRule {
  @PrimaryGeneratedColumn({ name: 'RuleId' })
  ruleId!: number;

  @Column({ name: 'HostelId', type: 'int' })
  hostelId!: number;

  @Column({ name: 'RuleType', type: 'varchar', length: 50 })
  ruleType!: string;

  @Column({ name: 'RuleMode', type: 'varchar', length: 50 })
  mode!: string;

  @Column({ name: 'Values', type: 'simple-json', nullable: true })
  values!: string[];

  @Column({ name: 'IsActive', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @ManyToOne(() => Hostel, (h) => h.eligibilityRules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'HostelId' })
  hostel!: Hostel;
}
