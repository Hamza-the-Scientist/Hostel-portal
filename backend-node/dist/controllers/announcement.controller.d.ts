import { Request, Response, NextFunction } from 'express';
export declare class AnnouncementController {
    static getPublicAnnouncements(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAllAnnouncements(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createAnnouncement(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateAnnouncement(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteAnnouncement(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=announcement.controller.d.ts.map