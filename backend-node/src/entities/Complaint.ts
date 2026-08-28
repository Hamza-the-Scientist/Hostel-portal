import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Complaints')
export class Complaint {
  @PrimaryGeneratedColumn({ name: 'ComplaintId' })
  complaintId!: number;

  @Column({ name: 'ResidentId', type: 'int' })
  residentId!: number;

  @Column({ name: 'Category', type: 'varchar', length: 20 })
  category!: string;

  @Column({ name: 'Description', type: 'varchar', length: 2000 })
  description!: string;

  @Column({ name: 'Status', type: 'varchar', length: 20, default: 'Open' })
  status!: string;

  @Column({ name: 'IsDeleted', type: 'boolean', default: false })
  isDeleted!: boolean;

  @Column({ name: 'DeletedAt', type: 'datetime', nullable: true })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;
}
