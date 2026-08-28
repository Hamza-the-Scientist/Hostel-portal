import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Payments')
export class Payment {
  @PrimaryGeneratedColumn({ name: 'PaymentId' })
  paymentId!: number;

  @Column({ name: 'ChallanId', type: 'int' })
  challanId!: number;

  @Column({ name: 'Amount', type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ name: 'TransactionRef', type: 'varchar', length: 100, unique: true })
  transactionRef!: string;

  @Column({ name: 'PaymentMethod', type: 'varchar', length: 50, nullable: true })
  paymentMethod!: string | null;

  @Column({ name: 'PaidAt', type: 'datetime' })
  paidAt!: Date;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;
}
