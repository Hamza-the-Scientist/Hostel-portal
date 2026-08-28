import { Room } from './Room';
import { Allocation } from './Allocation';
export declare class Bed {
    bedId: number;
    roomId: number;
    bedLabel: string;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    room: Room;
    allocations: Allocation[];
}
//# sourceMappingURL=Bed.d.ts.map