import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Program } from './Program';

@Entity('Departments')
export class Department {
  @PrimaryGeneratedColumn({ name: 'DepartmentId' })
  departmentId!: number;

  @Column({ name: 'Name', type: 'varchar', length: 150 })
  name!: string;

  @Column({ name: 'Code', type: 'varchar', length: 20, unique: true })
  code!: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @OneToMany(() => Program, (p) => p.department)
  programs!: Program[];
}
