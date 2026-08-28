import { User } from './User';
import { StudentProfile } from './StudentProfile';
import { UniversityStudentRecord } from './UniversityStudentRecord';
import { District } from './District';
import { Application } from './Application';
import { Allocation } from './Allocation';
export declare class Student {
    studentId: number;
    userId: number;
    registrationNumber: string;
    cnic: string;
    gender: string;
    dateOfBirth: string;
    districtId: number | null;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    district: District | null;
    profile: StudentProfile;
    universityRecord: UniversityStudentRecord;
    applications: Application[];
    allocations: Allocation[];
}
//# sourceMappingURL=Student.d.ts.map