export declare class HostelService {
    private hostelRepo;
    getPublicHostels(): Promise<{
        hostelId: number;
        name: string;
        gender: string;
        location: string;
        mainImageUrl: string;
        totalCapacity: number;
        availableBeds: number;
        rating: number;
        keyAmenities: string[];
    }[]>;
    getPublicHostelById(id: number): Promise<{
        hostelId: number;
        name: string;
        gender: string;
        location: string;
        provost: string;
        provostPhone: string;
        warden: string;
        wardenPhone: string;
        totalCapacity: number;
        occupiedBeds: number;
        availableBeds: number;
        rating: number;
        reviewCount: number;
        isAllocationOpen: boolean;
        images: string[];
        amenities: string[];
        eligibilitySummary: string[];
    }>;
}
//# sourceMappingURL=hostel.service.d.ts.map