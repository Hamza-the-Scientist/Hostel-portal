import { Student } from './Student';
import { AcademicYear } from './AcademicYear';
import { ApplicationHostelPreference } from './ApplicationHostelPreference';
import { Allocation } from './Allocation';
export declare class Application {
    applicationId: number;
    studentId: number;
    academicYearId: number;
    status: string;
    submittedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    student: Student;
    academicYear: AcademicYear;
    preferences: ApplicationHostelPreference[];
    allocations: Allocation[];
}
//# sourceMappingURL=Application.d.ts.map