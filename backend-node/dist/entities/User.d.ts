import { Student } from './Student';
import { Admin } from './Admin';
import { Notification } from './Notification';
import { AuditLog } from './AuditLog';
export declare class User {
    userId: number;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    phoneNumber: string | null;
    lastLoginAt: Date | null;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    student: Student;
    admin: Admin;
    notifications: Notification[];
    auditLogs: AuditLog[];
}
//# sourceMappingURL=User.d.ts.map