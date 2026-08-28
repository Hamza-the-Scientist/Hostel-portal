export declare class AdminService {
    private studentRepo;
    private residentRepo;
    private appRepo;
    private bedRepo;
    private hostelRepo;
    private amenityRepo;
    private imageRepo;
    private settingsRepo;
    private roomChangeRepo;
    private complaintRepo;
    private allocRepo;
    getDashboardStats(): Promise<{
        totalStudents: number;
        totalResidents: number;
        totalApplicants: number;
        availableSeats: number;
        pendingApplications: number;
        pendingPayments: number;
        roomChangeRequests: number;
        openComplaints: number;
    }>;
    getAllocationStatus(): Promise<{
        open: boolean;
        deadline: string | null;
    }>;
    setAllocationStatus(open: boolean): Promise<{
        open: boolean;
        deadline: string | null;
    }>;
    getStudents(query: {
        name?: string;
        cnic?: string;
        rollNumber?: string;
    }): Promise<{
        studentId: number;
        cnic: string;
        rollNumber: string;
        name: string;
        department: string;
        academicYear: string;
        district: string;
        gender: string;
    }[]>;
    getHostels(): Promise<{
        hostelId: number;
        name: string;
        gender: string;
        address: string;
        description: string;
        eligibilityRequirement: string;
        totalRooms: number;
        allotedRooms: number;
        availableRooms: number;
        amenities: string[];
        images: string[];
        isActive: boolean;
    }[]>;
    createHostel(body: {
        name: string;
        gender?: string;
        address?: string;
        description?: string;
        eligibilityRequirement?: string;
        totalRooms?: number;
        amenities?: string[];
        images?: string[];
    }): Promise<{
        hostelId: number;
        name: string;
        gender: string;
        address: string;
        description: string;
        eligibilityRequirement: string;
        totalRooms: number;
        amenities: string[];
        images: string[];
        isActive: boolean;
    }>;
    updateHostel(id: number, body: {
        name: string;
        gender?: string;
        address?: string;
        description?: string;
        eligibilityRequirement?: string;
        totalRooms?: number;
        amenities?: string[];
        images?: string[];
    }): Promise<{
        hostelId: number;
        name: string;
        gender: string;
        address: string;
        description: string;
        eligibilityRequirement: string;
        totalRooms: number;
        amenities: string[];
        images: string[];
        isActive: boolean;
    }>;
    deleteHostel(id: number): Promise<{
        message: string;
    }>;
    private getHostelById;
}
//# sourceMappingURL=admin.service.d.ts.map