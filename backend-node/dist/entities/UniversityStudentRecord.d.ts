import { Student } from './Student';
import { Department } from './Department';
import { Program } from './Program';
export declare class UniversityStudentRecord {
    recordId: number;
    studentId: number;
    departmentId: number | null;
    programId: number | null;
    semester: number;
    cgpa: number;
    isVerified: boolean;
    verifiedAt: Date | null;
    verifiedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
    student: Student;
    department: Department | null;
    program: Program | null;
}
//# sourceMappingURL=UniversityStudentRecord.d.ts.map