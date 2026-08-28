import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Room } from './Room';
import { Allocation } from './Allocation';

@Entity('Beds')
export class Bed {
  @PrimaryGeneratedColumn({ name: 'BedId' })
  bedId!: number;

  @Column({ name: 'RoomId', type: 'int' })
  roomId!: number;

  @Column({ name: 'BedLabel', type: 'varchar', length: 10 })
  bedLabel!: string;

  @Column({ name: 'IsActive', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'IsDeleted', type: 'boolean', default: false })
  isDeleted!: boolean;

  @Column({ name: 'DeletedAt', type: 'datetime', nullable: true })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @ManyToOne(() => Room, (r) => r.beds, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'RoomId' })
  room!: Room;

  @OneToMany(() => Allocation, (a) => a.bed)
  allocations!: Allocation[];
}
