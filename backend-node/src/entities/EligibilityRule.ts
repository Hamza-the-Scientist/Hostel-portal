import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Hostel } from './Hostel';

@Entity('EligibilityRules')
export class EligibilityRule {
  @PrimaryGeneratedColumn({ name: 'RuleId' })
  ruleId!: number;

  @Column({ name: 'HostelId', type: 'int' })
  hostelId!: number;

  @Column({ name: 'RuleName', type: 'varchar', length: 150 })
  ruleName!: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @ManyToOne(() => Hostel, (h) => h.eligibilityRules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'HostelId' })
  hostel!: Hostel;
}
