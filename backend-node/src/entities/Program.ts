import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Department } from './Department';

@Entity('Programs')
export class Program {
  @PrimaryGeneratedColumn({ name: 'ProgramId' })
  programId!: number;

  @Column({ name: 'DepartmentId', type: 'int' })
  departmentId!: number;

  @Column({ name: 'Name', type: 'varchar', length: 150 })
  name!: string;

  @Column({ name: 'Code', type: 'varchar', length: 20, unique: true })
  code!: string;

  @Column({ name: 'DegreeType', type: 'varchar', length: 20 })
  degreeType!: string;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @ManyToOne(() => Department, (d) => d.programs)
  @JoinColumn({ name: 'DepartmentId' })
  department!: Department;
}
