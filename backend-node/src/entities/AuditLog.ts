import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity('AuditLogs')
export class AuditLog {
  @PrimaryGeneratedColumn({ name: 'LogId' })
  logId!: number;

  @Column({ name: 'TableName', type: 'varchar', length: 100 })
  tableName!: string;

  @Column({ name: 'RecordId', type: 'varchar', length: 50 })
  recordId!: string;

  @Column({ name: 'Action', type: 'varchar', length: 10 })
  action!: string;

  @Column({ name: 'OldValues', type: 'json', nullable: true })
  oldValues!: any;

  @Column({ name: 'NewValues', type: 'json', nullable: true })
  newValues!: any;

  @Column({ name: 'IpAddress', type: 'varchar', length: 45, nullable: true })
  ipAddress!: string | null;

  @Column({ name: 'PerformedByUserId', type: 'int', nullable: true })
  performedByUserId!: number | null;

  @CreateDateColumn({ name: 'PerformedAt' })
  performedAt!: Date;

  @ManyToOne(() => User, (u) => u.auditLogs, { nullable: true })
  @JoinColumn({ name: 'PerformedByUserId' })
  performedBy!: User | null;
}
