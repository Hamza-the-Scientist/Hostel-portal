import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Block } from './Block';
import { Room } from './Room';

@Entity('Floors')
export class Floor {
  @PrimaryGeneratedColumn({ name: 'FloorId' })
  floorId!: number;

  @Column({ name: 'BlockId', type: 'int' })
  blockId!: number;

  @Column({ name: 'FloorNumber', type: 'int' })
  floorNumber!: number;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @ManyToOne(() => Block, (b) => b.floors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'BlockId' })
  block!: Block;

  @OneToMany(() => Room, (r) => r.floor)
  rooms!: Room[];
}
