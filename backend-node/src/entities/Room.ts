import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Floor } from './Floor';
import { Bed } from './Bed';

@Entity('Rooms')
export class Room {
  @PrimaryGeneratedColumn({ name: 'RoomId' })
  roomId!: number;

  @Column({ name: 'FloorId', type: 'int' })
  floorId!: number;

  @Column({ name: 'RoomNumber', type: 'varchar', length: 20 })
  roomNumber!: string;

  @Column({ name: 'RoomType', type: 'varchar', length: 10, default: 'Double' })
  roomType!: string;

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

  @ManyToOne(() => Floor, (f) => f.rooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'FloorId' })
  floor!: Floor;

  @OneToMany(() => Bed, (b) => b.room)
  beds!: Bed[];
}
