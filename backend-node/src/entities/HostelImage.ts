import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { Hostel } from './Hostel';

@Entity('HostelImages')
export class HostelImage {
  @PrimaryGeneratedColumn({ name: 'ImageId' })
  imageId!: number;

  @Column({ name: 'HostelId', type: 'int' })
  hostelId!: number;

  @Column({ name: 'ImageUrl', type: 'varchar', length: 500 })
  imageUrl!: string;

  @Column({ name: 'IsPrimary', type: 'boolean', default: false })
  isPrimary!: boolean;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @ManyToOne(() => Hostel, (h) => h.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'HostelId' })
  hostel!: Hostel;
}
