import { User } from './User';
export declare class Notification {
    notificationId: number;
    userId: number;
    title: string;
    message: string;
    isRead: boolean;
    link: string | null;
    sentAt: Date;
    readAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
//# sourceMappingURL=Notification.d.ts.map