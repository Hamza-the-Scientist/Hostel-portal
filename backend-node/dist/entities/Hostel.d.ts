import { HostelAmenity } from './HostelAmenity';
import { HostelImage } from './HostelImage';
import { Block } from './Block';
import { Review } from './Review';
import { EligibilityRule } from './EligibilityRule';
import { ApplicationHostelPreference } from './ApplicationHostelPreference';
export declare class Hostel {
    hostelId: number;
    name: string;
    gender: string;
    totalCapacity: number;
    address: string | null;
    description: string | null;
    eligibilityRequirement: string | null;
    warden: string | null;
    wardenPhone: string | null;
    get provost(): string | null;
    set provost(value: string | null);
    get provostPhone(): string | null;
    set provostPhone(value: string | null);
    isActive: boolean;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    amenities: HostelAmenity[];
    images: HostelImage[];
    blocks: Block[];
    reviews: Review[];
    eligibilityRules: EligibilityRule[];
    preferences: ApplicationHostelPreference[];
}
//# sourceMappingURL=Hostel.d.ts.map