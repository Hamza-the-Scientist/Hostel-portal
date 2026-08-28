import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Challans')
export class Challan {
  @PrimaryGeneratedColumn({ name: 'ChallanId' })
  challanId!: number;

  @Column({ name: 'FeeId', type: 'int' })
  feeId!: number;

  @Column({ name: 'ChallanNumber', type: 'varchar', length: 50, unique: true })
  challanNumber!: string;

  @Column({ name: 'DueDate', type: 'date' })
  dueDate!: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;
}
