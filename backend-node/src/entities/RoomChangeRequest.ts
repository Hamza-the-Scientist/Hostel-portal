import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('RoomChangeRequests')
export class RoomChangeRequest {
  @PrimaryGeneratedColumn({ name: 'RequestId' })
  requestId!: number;

  @Column({ name: 'ResidentId', type: 'int' })
  residentId!: number;

  @Column({ name: 'RequestedRoomId', type: 'int', nullable: true })
  requestedRoomId!: number | null;

  @Column({ name: 'Reason', type: 'varchar', length: 1000, nullable: true })
  reason!: string | null;

  @Column({ name: 'Status', type: 'varchar', length: 20, default: 'Pending' })
  status!: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;
}
