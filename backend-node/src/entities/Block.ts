import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Hostel } from './Hostel';
import { Floor } from './Floor';

@Entity('Blocks')
export class Block {
  @PrimaryGeneratedColumn({ name: 'BlockId' })
  blockId!: number;

  @Column({ name: 'HostelId', type: 'int' })
  hostelId!: number;

  @Column({ name: 'BlockName', type: 'varchar', length: 50 })
  blockName!: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @ManyToOne(() => Hostel, (h) => h.blocks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'HostelId' })
  hostel!: Hostel;

  @OneToMany(() => Floor, (f) => f.block)
  floors!: Floor[];
}
