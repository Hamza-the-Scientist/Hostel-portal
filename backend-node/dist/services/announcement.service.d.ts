import { Announcement } from '../entities/Announcement';
export declare class AnnouncementService {
    private announcementRepo;
    getPublicAnnouncements(): Promise<{
        announcementId: number;
        title: string;
        content: string;
        publishedAt: string;
    }[]>;
    getAllAnnouncements(): Promise<{
        announcementId: number;
        adminId: number;
        title: string;
        content: string;
        isPublished: boolean;
        publishedAt: Date | null;
        expiresAt: Date | null;
        targetAudience: string | null;
        createdAt: Date;
    }[]>;
    createAnnouncement(adminId: number, body: {
        title: string;
        content: string;
        targetAudience?: string;
    }): Promise<Announcement>;
    updateAnnouncement(id: number, body: {
        title?: string;
        content?: string;
        isPublished?: boolean;
    }): Promise<Announcement>;
    deleteAnnouncement(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=announcement.service.d.ts.map