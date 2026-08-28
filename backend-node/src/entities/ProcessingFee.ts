import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ProcessingFees')
export class ProcessingFee {
  @PrimaryGeneratedColumn({ name: 'FeeId' })
  feeId!: number;

  @Column({ name: 'ApplicationId', type: 'int', unique: true })
  applicationId!: number;

  @Column({ name: 'Amount', type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ name: 'Status', type: 'varchar', length: 10, default: 'Pending' })
  status!: string;

  @Column({ name: 'DueDate', type: 'date' })
  dueDate!: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;
}
