import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Hostel } from './Hostel';

@Entity('Reviews')
export class Review {
  @PrimaryGeneratedColumn({ name: 'ReviewId' })
  reviewId!: number;

  @Column({ name: 'ResidentId', type: 'int' })
  residentId!: number;

  @Column({ name: 'HostelId', type: 'int' })
  hostelId!: number;

  @Column({ name: 'OverallRating', type: 'float', default: 5.0 })
  overallRating!: number;

  @Column({ name: 'Comment', type: 'text', nullable: true })
  comment!: string | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @ManyToOne(() => Hostel, (h) => h.reviews)
  @JoinColumn({ name: 'HostelId' })
  hostel!: Hostel;
}
