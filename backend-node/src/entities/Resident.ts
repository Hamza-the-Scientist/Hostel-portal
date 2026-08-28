import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Allocation } from './Allocation';

@Entity('Residents')
export class Resident {
  @PrimaryGeneratedColumn({ name: 'ResidentId' })
  residentId!: number;

  @Column({ name: 'AllocationId', type: 'int' })
  allocationId!: number;

  @Column({ name: 'CheckInDate', type: 'date' })
  checkInDate!: string;

  @Column({ name: 'CheckOutDate', type: 'date', nullable: true })
  checkOutDate!: string | null;

  @Column({ name: 'IsCurrentResident', type: 'boolean', default: true })
  isCurrentResident!: boolean;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @OneToOne(() => Allocation, (a) => a.resident)
  @JoinColumn({ name: 'AllocationId' })
  allocation!: Allocation;
}
