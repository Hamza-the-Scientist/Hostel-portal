export declare class StudentService {
    private studentRepo;
    private profileRepo;
    getProfile(userId: number): Promise<{
        studentId: number;
        verifiedInfo: {
            fullName: string;
            rollNumber: string;
            cnic: string;
            department: string;
            program: string;
            semester: number;
            cgpa: number;
            academicYear: string;
            district: string;
            gender: string;
            dateOfBirth: string;
        };
        personalInfo: {
            email: string;
            phoneNumber: string;
            profilePictureUrl: string | null;
            guardianName: string | null;
            guardianPhone: string | null;
            guardianRelation: string | null;
            homeAddress: string | null;
            permanentAddress: string | null;
            city: string | null;
            emergencyContact: string | null;
            bloodGroup: string | null;
            disabilities: string | null;
            specialAccommodation: string | null;
        };
    }>;
    updateProfile(userId: number, body: any): Promise<{
        studentId: number;
        verifiedInfo: {
            fullName: string;
            rollNumber: string;
            cnic: string;
            department: string;
            program: string;
            semester: number;
            cgpa: number;
            academicYear: string;
            district: string;
            gender: string;
            dateOfBirth: string;
        };
        personalInfo: {
            email: string;
            phoneNumber: string;
            profilePictureUrl: string | null;
            guardianName: string | null;
            guardianPhone: string | null;
            guardianRelation: string | null;
            homeAddress: string | null;
            permanentAddress: string | null;
            city: string | null;
            emergencyContact: string | null;
            bloodGroup: string | null;
            disabilities: string | null;
            specialAccommodation: string | null;
        };
    }>;
}
//# sourceMappingURL=student.service.d.ts.map