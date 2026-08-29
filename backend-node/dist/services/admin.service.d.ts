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
    getResidents(filter?: any): Promise<{
        residentId: number;
        studentId: number;
        studentName: string;
        cnic: string;
        rollNumber: string;
        department: string;
        district: string;
        gender: string;
        hostelId: number;
        hostelName: string;
        block: string;
        room: string;
        bed: string;
        academicYear: string;
        annualFeeStatus: string;
        annualFeeAmount: number;
        status: string;
    }[]>;
    generateAnnualChallan(studentId: number, amount: number): Promise<{
        success: boolean;
        challanNumber: string;
    }>;
    getRoomHistory(studentId: number): Promise<{
        historyId: number;
        date: string;
        hostel: string;
        block: string;
        room: string;
        bed: string;
        action: string;
        status: string;
    }[]>;
    getRoomChangeRequest(studentId: number): Promise<{
        requestId: number;
        requestDate: Date;
        reason: string | null;
        currentRoom: {
            hostel: string;
            block: string;
            room: string;
            bed: string;
        };
        requestedRoom: {
            hostel: any;
            block: any;
            room: any;
            bed: string;
        } | null;
    } | null>;
    approveRoomChange(studentId: number, requestId: number): Promise<{
        success: boolean;
    }>;
    rejectRoomChange(studentId: number, requestId: number, reason: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=admin.service.d.ts.map