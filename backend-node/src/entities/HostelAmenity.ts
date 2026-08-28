import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { Hostel } from './Hostel';

@Entity('HostelAmenities')
export class HostelAmenity {
  @PrimaryGeneratedColumn({ name: 'AmenityId' })
  amenityId!: number;

  @Column({ name: 'HostelId', type: 'int' })
  hostelId!: number;

  @Column({ name: 'AmenityName', type: 'varchar', length: 100 })
  amenityName!: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @ManyToOne(() => Hostel, (h) => h.amenities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'HostelId' })
  hostel!: Hostel;
}
