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
    getDistrictEligibility(userId: number): Promise<{
        isAllowed: boolean;
        districtName: string;
        message: string;
    }>;
    getApplication(userId: number): Promise<{
        applicationId: number;
        studentId: number;
        studentName: string;
        rollNumber: string;
        district: string;
        isDistrictAllowed: boolean;
        districtEligibilityMessage: string;
        status: string;
        displayStatus: string;
        submittedAt: string | undefined;
        processingFee: {
            feeId: number;
            challanNumber: string;
            amount: number;
            status: string;
            createdAt: string;
            dueDate: string;
        };
        preferences: {
            hostelId: number;
            name: string;
            gender: string;
            location: string;
            totalCapacity: number;
            availableBeds: number;
            rating: number;
            keyAmenities: string[];
            isEligible: boolean;
            eligibilityReason: string;
        }[];
        timeline: {
            stepName: string;
            isCompleted: boolean;
            isCurrent: boolean;
            description: string;
        }[];
    }>;
    submitApplication(userId: number, body?: any): Promise<{
        applicationId: number;
        studentId: number;
        studentName: string;
        rollNumber: string;
        district: string;
        isDistrictAllowed: boolean;
        districtEligibilityMessage: string;
        status: string;
        displayStatus: string;
        submittedAt: string | undefined;
        processingFee: {
            feeId: number;
            challanNumber: string;
            amount: number;
            status: string;
            createdAt: string;
            dueDate: string;
        };
        preferences: {
            hostelId: number;
            name: string;
            gender: string;
            location: string;
            totalCapacity: number;
            availableBeds: number;
            rating: number;
            keyAmenities: string[];
            isEligible: boolean;
            eligibilityReason: string;
        }[];
        timeline: {
            stepName: string;
            isCompleted: boolean;
            isCurrent: boolean;
            description: string;
        }[];
    }>;
}
//# sourceMappingURL=student.service.d.ts.map