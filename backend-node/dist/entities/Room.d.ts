import { Floor } from './Floor';
import { Bed } from './Bed';
export declare class Room {
    roomId: number;
    floorId: number;
    roomNumber: string;
    roomType: string;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    floor: Floor;
    beds: Bed[];
}
//# sourceMappingURL=Room.d.ts.map