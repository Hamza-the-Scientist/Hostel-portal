import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';

@Entity('Districts')
export class District {
  @PrimaryGeneratedColumn({ name: 'DistrictId' })
  districtId!: number;

  @Column({ name: 'Name', type: 'varchar', length: 100 })
  name!: string;

  @Column({ name: 'Province', type: 'varchar', length: 50, default: 'Sindh' })
  province!: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @OneToMany(() => Student, (s) => s.district)
  students!: Student[];
}
