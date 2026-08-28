import { Admin } from './Admin';
export declare class Announcement {
    announcementId: number;
    adminId: number;
    title: string;
    content: string;
    isPublished: boolean;
    publishedAt: Date | null;
    expiresAt: Date | null;
    targetAudience: string | null;
    createdAt: Date;
    updatedAt: Date;
    admin: Admin;
}
//# sourceMappingURL=Announcement.d.ts.map