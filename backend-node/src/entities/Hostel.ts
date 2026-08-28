import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { HostelAmenity } from './HostelAmenity';
import { HostelImage } from './HostelImage';
import { Block } from './Block';
import { Review } from './Review';
import { EligibilityRule } from './EligibilityRule';
import { ApplicationHostelPreference } from './ApplicationHostelPreference';

@Entity('Hostels')
export class Hostel {
  @PrimaryGeneratedColumn({ name: 'HostelId' })
  hostelId!: number;

  @Column({ name: 'Name', type: 'varchar', length: 150 })
  name!: string;

  @Column({ name: 'Gender', type: 'varchar', length: 10 })
  gender!: string;

  @Column({ name: 'TotalCapacity', type: 'int', default: 0 })
  totalCapacity!: number;

  @Column({ name: 'Address', type: 'text', nullable: true })
  address!: string | null;

  @Column({ name: 'Description', type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'EligibilityRequirement', type: 'text', nullable: true })
  eligibilityRequirement!: string | null;

  @Column({ name: 'Warden', type: 'varchar', length: 150, nullable: true })
  warden!: string | null;

  @Column({ name: 'WardenPhone', type: 'varchar', length: 20, nullable: true })
  wardenPhone!: string | null;

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

  @OneToMany(() => HostelAmenity, (a) => a.hostel, { cascade: true })
  amenities!: HostelAmenity[];

  @OneToMany(() => HostelImage, (i) => i.hostel, { cascade: true })
  images!: HostelImage[];

  @OneToMany(() => Block, (b) => b.hostel)
  blocks!: Block[];

  @OneToMany(() => Review, (r) => r.hostel)
  reviews!: Review[];

  @OneToMany(() => EligibilityRule, (r) => r.hostel)
  eligibilityRules!: EligibilityRule[];

  @OneToMany(() => ApplicationHostelPreference, (p) => p.hostel)
  preferences!: ApplicationHostelPreference[];
}
