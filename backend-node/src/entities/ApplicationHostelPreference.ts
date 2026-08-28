import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Application } from './Application';
import { Hostel } from './Hostel';

@Entity('ApplicationHostelPreferences')
export class ApplicationHostelPreference {
  @PrimaryGeneratedColumn({ name: 'PrefId' })
  prefId!: number;

  @Column({ name: 'ApplicationId', type: 'int' })
  applicationId!: number;

  @Column({ name: 'HostelId', type: 'int' })
  hostelId!: number;

  @Column({ name: 'PreferenceOrder', type: 'int', default: 1 })
  preferenceOrder!: number;

  @CreateDateColumn({ name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UpdatedAt' })
  updatedAt!: Date;

  @ManyToOne(() => Application, (a) => a.preferences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ApplicationId' })
  application!: Application;

  @ManyToOne(() => Hostel, (h) => h.preferences)
  @JoinColumn({ name: 'HostelId' })
  hostel!: Hostel;
}
