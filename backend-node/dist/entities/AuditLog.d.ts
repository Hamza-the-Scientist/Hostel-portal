import { User } from './User';
export declare class AuditLog {
    logId: number;
    tableName: string;
    recordId: string;
    action: string;
    oldValues: any;
    newValues: any;
    ipAddress: string | null;
    performedByUserId: number | null;
    performedAt: Date;
    performedBy: User | null;
}
//# sourceMappingURL=AuditLog.d.ts.map