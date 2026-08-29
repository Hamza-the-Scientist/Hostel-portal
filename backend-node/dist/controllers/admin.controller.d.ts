import { Request, Response, NextFunction } from 'express';
export declare class AdminController {
    static getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAllocationStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    static setAllocationStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getStudents(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getHostels(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createHostel(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateHostel(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteHostel(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getResidents(req: Request, res: Response, next: NextFunction): Promise<void>;
    static assignChallan(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getRoomHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getRoomChangeRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    static approveRoomChange(req: Request, res: Response, next: NextFunction): Promise<void>;
    static rejectRoomChange(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=admin.controller.d.ts.map