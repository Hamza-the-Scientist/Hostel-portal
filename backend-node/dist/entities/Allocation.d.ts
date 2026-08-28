import { Application } from './Application';
import { Student } from './Student';
import { Bed } from './Bed';
import { Resident } from './Resident';
export declare class Allocation {
    allocationId: number;
    applicationId: number;
    studentId: number;
    bedId: number;
    allocatedAt: Date;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    application: Application;
    student: Student;
    bed: Bed;
    resident: Resident;
}
//# sourceMappingURL=Allocation.d.ts.map